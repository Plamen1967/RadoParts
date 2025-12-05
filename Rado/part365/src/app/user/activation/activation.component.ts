import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@services/dialog-api/modal.service';
import { UserService } from '@services/user.service';

@Component({
  standalone: true,
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
  imports: []
})
export default class ActivationComponent implements OnDestroy, AfterViewInit {

  activationCode?: string;
  error?: string
  message?: string;
  loading?: boolean
  ngbModuleRef?: NgbModalRef;
  messageUserActivated?: string;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private modalService: ModalService) { }

    ngOnDestroy(): void {
    this.modalService.removeDialog('messageUserActivated')
  }

  ngInit() {
    this.activationCode = this.route.snapshot.queryParamMap.get('id') ?? '';
  }
  ngAfterViewInit() {
    this.loading = true;
    this.userService.activateUser(this.activationCode!).subscribe({
      next: (message) => {
        this.message = message
        this.ngbModuleRef = this.modalService.openDialog(this.messageUserActivated!);
        setTimeout(() => {
          this.ngbModuleRef?.close()
          this.router.navigate(['/']);
        },
          2000);

      },
      error: (error) => this.error = error,
      complete: () => this.loading = false
    })
  }
}

