import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { CategoryGridComponent } from '../../components/category-grid/category-grid.component';
import { AboutFindUsComponent } from '../../components/about-find-us/about-find-us.component';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    HeroSectionComponent,
    CategoryGridComponent,
    AboutFindUsComponent,
    ProductGridComponent
  ]
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  trendingProducts: any[] = [];

  constructor(
    private http: HttpClient,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Home');
    this.http.get<any[]>('/api/products').subscribe(data => {
      this.products = data;
      this.trendingProducts = data
        .filter(p => p.isNew?.toLowerCase() === 'yes')
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    });
  }

  onLikeToggled() {
  }
}
