import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { CarFilterComponent } from './carfilter.component'

describe('CarFilterComponent', () => {
    let component: CarFilterComponent
    let fixture: ComponentFixture<CarFilterComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CarFilterComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(CarFilterComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
