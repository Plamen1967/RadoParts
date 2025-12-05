import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { ModalService } from '@services/dialog-api/modal.service';
import { UserService } from '@services/user.service';

@Component({
  standalone: true,
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'],
  imports: [ReactiveFormsModule, NgStyle, NgClass]
})
export default class RecoveryComponent extends HelperComponent implements OnInit {

  submitted?: boolean
  recoveryForm: FormGroup;
  error?: string;
  id? : string;
  account?: string;
  message?: string;
  title = "Recovery of account"

  showFlag = false;
  type = "password";
  showFlag2 = false;
  type2 = "password";
  autocomplete = "nope"

  constructor(private formBuilder: FormBuilder,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { super() 
    this.recoveryForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      userName: ['', Validators.required]})
}

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id') ?? undefined;
    if (this.id) {
      this.title = "Въведете нова парола";
      this.userService.getAccountByActivationCode(this.id).subscribe((message) => {
        this.account = message.email;
      })
    } else {
      this.router.navigate(['/']);
      return;
    };

    setTimeout(() => this.recoveryForm.patchValue({xxx: '', xxx2: ''}), 200);

  }

  get f() {
    return this.recoveryForm.controls;
  }

  onSubmit() {
    this.onOk();
  }

  show() {
    this.showFlag = !this.showFlag;
    this.type = this.showFlag ? "text" : "password"
  }

  show2() {
    this.showFlag2 = !this.showFlag2;
    this.type2 = this.showFlag2 ? "text" : "password"
  }

  onOk() {
    if (!this.id) {
      this.userService.recoverUser(this.f['userName'].value).subscribe(() => {
        this.message = this.labels.RECOVERYUSER
        setTimeout(
          () => {
            this.router.navigate(['/']);
          },
          4000);
  
      })
    } else {
      this.userService.unLockUser(this.f['password'].value, this.id).subscribe(() => {
        this.message = "Акаунта е възстановен!"
        setTimeout(
          () => {
            
            this.router.navigate([`/`])},
          2000);
  
      })
    }


  }

  cancel() {
    this.router.navigate([`/`])
  }

}
