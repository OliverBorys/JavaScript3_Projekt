import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.http.get('/api/products').subscribe(products => {
      console.log(products);
    });
  }

  onSearchSubmit(): void {
    const trimmed = this.searchQuery.trim();
    if (trimmed) {
      this.router.navigate(['/search'], {
        queryParams: { q: trimmed }
      });
      this.searchQuery = '';
    }
  }
}
