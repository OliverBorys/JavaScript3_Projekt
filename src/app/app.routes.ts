import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ContactComponent } from './routes/contact/contact.component';
import { AboutComponent } from './routes/about/about.component';
import { ShopComponent } from './routes/shop/shop.component';

export const routes: Routes = [
  { path: '',component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },

];
