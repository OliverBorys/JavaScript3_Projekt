import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ContactComponent } from './routes/contact/contact.component';
import { AboutComponent } from './routes/about/about.component';
import { ShopComponent } from './routes/shop/shop.component';
import { ProductDetailsComponent } from './routes/product-details/product-details.component';
import { SearchComponent } from './routes/search/search.component';

export const routes: Routes = [
  { path: '',component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'search', component: SearchComponent },

];
