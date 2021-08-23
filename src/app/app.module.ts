import { DashboardComponent } from './components/dashboard/dashboard.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {TableComponent} from './components/project/table/table.component';
import {DetailsComponent} from './components/project/details/details.component';
import {PiloteComponent} from './components/pilote/pilote.component';
import {AjouterComponent} from './components/project/ajouter/ajouter.component';
import {ModifierComponent} from './components/project/modifier/modifier.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {PilotesComponent} from './components/pilote/pilotes/pilotes.component';
import {AjouterPiloteComponent} from './components/pilote/ajouter-pilote/ajouter-pilote.component';
import {EditPiloteComponent} from './components/pilote/edit-pilote/edit-pilote.component';
import {AjouterXlsxComponent} from './components/project/ajouter-xlsx/ajouter-xlsx.component';
import {AccountComponent} from './components/account/account.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {AdminGuard} from './guards/admin.guard';
import {UserGuard} from './guards/user.guard';
import {LoginTempsComponent} from './components/login-temps/login-temps.component';
import {RaportComponent} from './components/raport/raport.component';
import {ModelOneComponent} from './components/documents/model-one/model-one.component';
import {ModelHistoryComponent} from './components/documents/model-history/model-history.component';
import {ModelHviwerComponent} from './components/documents/model-hviwer/model-hviwer.component';
import {ReplacePipe} from './pipes/replace.pipe';
import {NullPipe} from './pipes/null.pipe';
import {BordereauComponent} from './components/documents/bordereau/bordereau.component';
import {NgxSummernoteModule} from 'ngx-summernote';
import {ToastrModule} from 'ngx-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BordereauHistoryComponent} from './components/documents/bordereau-history/bordereau-history.component';
import {BordereauHviwerComponent} from './components/documents/bordereau-hviwer/bordereau-hviwer.component';
import {NgxPopperjsModule} from 'ngx-popperjs';
import {FacturesComponent} from './components/documents/factures/factures.component';
import {FactureHistoryComponent} from './components/documents/facture-history/facture-history.component';
import {FactureHviwerComponent} from './components/documents/facture-hviwer/facture-hviwer.component';
import {MainComponent} from './components/pointage_mensuel/main/main.component';
import {MomentModule} from "ngx-moment";


const appRoute: Routes = [
  {path: 'details/:id', component: DetailsComponent, canActivate: [UserGuard]},
  {path: 'pilote/:id', component: PiloteComponent, canActivate: [UserGuard]},
  {path: 'modifer/:id', component: ModifierComponent, canActivate: [AdminGuard]},
  {path: 'projectlist', component: TableComponent, canActivate: [UserGuard]},
  {path: 'ajouter', component: AjouterComponent, canActivate: [AdminGuard]},
  {path: 'pilotes', component: PilotesComponent, canActivate: [UserGuard]},
  {path: 'xslx_ajouter', component: AjouterXlsxComponent, canActivate: [AdminGuard]},
  {path: 'signin', component: LoginComponent},
  {path: '', component: DashboardComponent, canActivate: [AdminGuard]},
  {path: 'models', component: RaportComponent, canActivate: [AdminGuard]},
  {path: 'model1', component: ModelOneComponent, canActivate: [AdminGuard]},
  {path: 'modelshistory', component: ModelHistoryComponent, canActivate: [AdminGuard]},
  {path: 'modelshistory/:ref', component: ModelHviwerComponent, canActivate: [AdminGuard]},
  {path: 'bordereau', component: BordereauComponent},
  {path: 'bordereaushistory', component: BordereauHistoryComponent},
  {path: 'bordereaushistory/:ref', component: BordereauHviwerComponent},
  {path: 'factures', component: FacturesComponent},
  {path: 'factureshistory', component: FactureHistoryComponent},
  {path: 'factureshistory/:ref', component: FactureHviwerComponent},
  {path: 'pointage', component: MainComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableComponent,
    DetailsComponent,
    PiloteComponent,
    AjouterComponent,
    ModifierComponent,
    LoginComponent,
    RegisterComponent,
    PilotesComponent,
    AjouterPiloteComponent,
    EditPiloteComponent,
    AjouterXlsxComponent,
    AccountComponent,
    SpinnerComponent,
    LoginTempsComponent,
    RaportComponent,
    ModelOneComponent,
    ModelHistoryComponent,
    ModelHviwerComponent,
    ReplacePipe,
    NullPipe,
    BordereauComponent,
    BordereauHistoryComponent,
    BordereauHviwerComponent,
    FacturesComponent,
    FactureHistoryComponent,
    FactureHviwerComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoute, {useHash: true}),
    ReactiveFormsModule,
    NgxSummernoteModule,
    ToastrModule.forRoot({positionClass: 'toast-bottom-right'}),
    NgxPopperjsModule,
    MomentModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
