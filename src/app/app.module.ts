import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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
registerLocaleData(localeNl);

const appRoutes: Routes = [
    { path: '', redirectTo: '/welkom', pathMatch: 'full' },
    { path: 'inloggen', component: LoginComponent },
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
    { path: 'klantenservice/bestelling', component: OrderingComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/betaling', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/verzending', component: ShipmentComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/retouren', component: ReturnsComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/voorwaarden', component: TermsComponent, canActivate: [AuthGuard] },
    { path: 'klantenservice/privacy', component: PrivacyComponent, canActivate: [AuthGuard] },
    { path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
    { path: 'anker', component: AnkerComponent, canActivate: [AuthGuard] },
    { path: 'over-ons', component: AboutUsComponent, canActivate: [AuthGuard] },
    { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
    { path: 'winkelwagen', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'winkelwagen/bestellen', component: CheckoutComponent, canActivate: [AuthGuard] }
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
        UserSuccessComponent
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
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
