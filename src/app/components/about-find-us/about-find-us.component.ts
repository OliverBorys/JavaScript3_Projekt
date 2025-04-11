import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-about-find-us',
  imports: [CommonModule],
  templateUrl: './about-find-us.component.html',
  styleUrl: './about-find-us.component.css'
})
export class AboutFindUsComponent {
constructor(private router: Router) {}

sections = [
  {
    name: 'About Us',
    img: 'https://png.pngtree.com/background/20230516/original/pngtree-stock-image-of-a-clothing-rack-picture-image_2601916.jpg',
    link: '/about'
  },
  {
    name: 'Find Us',
    img: 'https://png.pngtree.com/background/20221109/original/pngtree-city-map-gps-navigation-with-location-pin-markers-picture-image_1953527.jpg',
    link: 'https://maps.app.goo.gl/JTQBjAJAU5h5yc6j9',
    external: true,
  }
];

handleClick(section: any): void {
  if (section.external) {
    window.open(section.link, '_blank');
  } else {
    this.router.navigate([section.link]);
  }
}
}
