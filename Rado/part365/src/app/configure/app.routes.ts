import { Routes, RunGuardsAndResolvers } from '@angular/router'
import { DealerWebPageComponent } from '@app/admin/components/admin/user/dealerWebPage/dealerWebPage.component'
import { LoginComponent } from '@app/admin/components/admin/user/login/login.component'
import { AuthGuard } from '@app/guard/authGuard'
import { HomeComponent } from '@app/search/home/Home.component'
import { CheckOutComponent } from '@components/custom-controls/check-out/check-out.component'
import { UserViewPartComponent } from '@components/parts/userViewPart/userViewPart.component'
import { ResultComponent } from '@components/result/result.component'

const runGuardsAndResolvers: RunGuardsAndResolvers = 'paramsOrQueryParamsChange'

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'query', component: HomeComponent, pathMatch: 'full', runGuardsAndResolvers: runGuardsAndResolvers },
    { path: 'results', component: ResultComponent },
    { 
        path: 'viewPart', 
        component: UserViewPartComponent, 
    },
    { path: 'checkout', component: CheckOutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dealerwebpage', component: DealerWebPageComponent, children: [
        {path: '', redirectTo:'details', pathMatch:'full'},
        {
            path: 'details', 
            loadComponent: () => import('../admin/components/admin/user/children/details/details.component')
        },
        {
            path: 'stock', 
            loadComponent: () => import('../admin/components/admin/user/children/stock/stock.component')
        },
        {
            path: 'contact', 
            loadComponent: () => import('../admin/components/admin/user/children/contact/contact.component')

        },
    ]},
    //#region data
    { 
        path: 'data/addNew', 
        loadComponent: () => import('../data/add-new/add-new.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/cars', 
        loadComponent: () => import('./../data/cars/listCars/listCars.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/addCar', 
        loadComponent: () => import('./../data/cars/addCar/addcar.component'),
        canActivate: [AuthGuard]
    },
    { 
        path: 'data/updateCar', 
        loadComponent: () => import('./../data/cars/updateCar/updateCar.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/viewCar', 
        loadComponent: () => import('./../data/cars/viewCar/viewCar.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/parts', 
        loadComponent: () => import('./../data/parts/listPart/listpart.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/addPart', 
        loadComponent: () => import('./../data/parts/addPart/addpart.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/updatePart', 
        loadComponent: () => import('./../data/parts/updatepart/updatepart.component'),
        canActivate: [AuthGuard] 
    },
    {   
        path: 'data/tyres', 
        loadComponent: () => import('./../data/tyre/listTyre/listTyre.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/addTyre', 
        loadComponent: () => import('./../data/tyre/addTyre/addTyre.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/updateTyre', 
        loadComponent: () => import('./../data/tyre/updateTyre/updateTyre.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/viewTyre', 
        loadComponent: () => import('./../data/tyre/viewTyre/viewTyre.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/bus', 
        loadComponent: () => import('./../data/bus/bus/bus.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/addBus', 
        loadComponent: () => import('./../data/bus/addBus/addBus.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'data/updateBus', 
        loadComponent: () => import('./../data/bus/updateBus/updatebus.component'),
        canActivate: [AuthGuard] 
    },
//#endregion data
    //#region admin    
// Admin data
    { 
        path: 'admin/company', 
        loadComponent: () => import('../admin/components/staticdata/company/company.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/model', 
        loadComponent: () => import('../admin/components/staticdata/model/model.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/modification', 
        loadComponent: () => import('../admin/components/staticdata/modification/modification.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/category', 
        loadComponent: () => import('../admin/components/staticdata/category-admin/category.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/subcategory', 
        loadComponent: () => import('../admin/components/staticdata/subCategory/subCategory.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/dealersubcategory', 
        loadComponent: () => import('../admin/components/staticdata/dealerSubCategory/dealerSubCategory.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin/users', 
        loadComponent: () => import('../admin/components/admin/administration/administration.component'),
        canActivate: [AuthGuard] 
    },
    //#endregion
    //#region info
    { 
        path: 'info/contact', 
        loadComponent: () => import('../info/contact/contact.component'),
    },
    { 
        path: 'info/terms', 
        loadComponent: () => import('../info/terms/terms.component'),
    },
    //#endregion
    //#region user
    // Admin users
    // Recovery Registration
    { 
        path: 'user/recovery', 
        loadComponent: () => import('../admin/components/admin/user/recovery/recovery.component'),
    },
    { 
        path: 'user/activateUser', 
        loadComponent: () => import('../admin/components/admin/user/activation/activation.component'),
    },
    { 
        path: 'user/unLockUser', 
        loadComponent: () => import('../admin/components/admin/user/activation/activation.component'),
    },
    { 
        path: 'user/user', 
        loadComponent: () => import('../admin/components/admin/user/user/user.component'),
    },
    { 
        path: 'user/dealerUpdate', 
        loadComponent: () => import('../admin/components/admin/user/dealerUpdate/dealerUpdate.component'),
    },
    { 
        path: 'user/updatepassword', 
        loadComponent: () => import('../admin/components/admin/user/password/password.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'user/userdetails', 
        loadComponent: () => import('../admin/components/admin/updateUser/updateUser.component'),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'user/messages', 
        loadComponent: () => import('./../messages/list-message/list-message.component'),
        canActivate: [AuthGuard] 
    },
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    //#endregion
    { path: '**', redirectTo: '/', pathMatch: 'full'},
]