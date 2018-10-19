import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';

import { QuecomProvider } from "./providers/quecom.provider";
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CartProvider } from "./providers/cart.provider";
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons/dist';
import { AnkerComponent } from './anker/anker.component';
import { ContactComponent } from './contact/contact.component';
import { OrderingComponent } from './ordering/ordering.component';
import { PaymentComponent } from './payment/payment.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { ReturnsComponent } from './returns/returns.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgStickyModule } from 'ng-sticky';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { ProductListingComponent } from "./product-listing/product-listing.component";
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./auth-guard.service";
import { AuthService } from "./auth.service";
import { Globals } from "./providers/globals";
import { MailProvider } from "./providers/mail.provider";
import { PimcoreProvider } from "./providers/pimcore.provider";
import { RegisterComponent } from './register/register.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MyAccountComponent } from './my-account/my-account.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MailSuccesfullComponent } from './mail-succesfull/mail-succesfull.component';
import { UserSuccessComponent } from './user-success/user-success.component';
import { SlideshowModule } from 'ng-simple-slideshow';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { StartupService } from './startup.service';
registerLocaleData(localeNl);

export function startupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load();
}

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'inloggen', component: LoginComponent },
    { path: 'wachtwoord-vergeten', component: ForgotPasswordComponent },
    { path: 'registreren', component: RegisterComponent },
    { path: 'registreren/succesvol', component: RegisterSuccessComponent },
    { path: 'email-validatie/succesvol', component: MailSuccesfullComponent },
    { path: 'gebruiker-validatie/succesvol', component: UserSuccessComponent },
    { path: 'welkom', component: WelcomeComponent },
    { path: 'mijn-account', component: MyAccountComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'producten', component: ProductListingComponent, canActivate: [AuthGuard] },
    { path: 'categorie/:id', component: ProductListingComponent, canActivate: [AuthGuard] },
    { path: 'subcategorie/:id', component: ProductListingComponent, canActivate: [AuthGuard] },
    { path: 'product-groep/:id', component: ProductListingComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/bestelling', component: OrderingComponent },
    { path: 'klantenservice/betaling', component: PaymentComponent },
    { path: 'klantenservice/verzending', component: ShipmentComponent },
    { path: 'klantenservice/retouren', component: ReturnsComponent },
    { path: 'klantenservice/voorwaarden', component: TermsComponent },
    { path: 'klantenservice/privacy', component: PrivacyComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
    { path: 'anker', component: AnkerComponent, canActivate: [AuthGuard] },
    { path: 'over-ons', component: AboutUsComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'winkelwagen', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'winkelwagen/bestellen', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'search/:query', component: ProductListingComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        AboutUsComponent,
        ProductDetailComponent,
        CartComponent,
        CheckoutComponent,
        AnkerComponent,
        ContactComponent,
        OrderingComponent,
        PaymentComponent,
        ShipmentComponent,
        ReturnsComponent,
        TermsComponent,
        PrivacyComponent,
        ProductListingComponent,
        LoginComponent,
        RegisterComponent,
        MyAccountComponent,
        RegisterSuccessComponent,
        WelcomeComponent,
        MailSuccesfullComponent,
        UserSuccessComponent,
        ForgotPasswordComponent,
        PrivacyPolicyComponent,
        OrderSuccessComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        Angular2PromiseButtonModule.forRoot(),
        SweetAlert2Module.forRoot(),
        Ng2Webstorage,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        NgStickyModule,
        SwiperModule,
        SlideshowModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "nl-NL" },
        QuecomProvider,
        CartProvider,
        MailProvider,
        AuthService,
        Globals,
        PimcoreProvider,
        AuthGuard,
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: startupServiceFactory,
            deps: [StartupService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
