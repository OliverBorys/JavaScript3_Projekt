import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { CategoryGridComponent } from '../../components/category-grid/category-grid.component';
import { AboutFindUsComponent } from '../../components/about-find-us/about-find-us.component';

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent, CategoryGridComponent, AboutFindUsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
