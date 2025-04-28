import { Component, Input, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { HeaderState } from '../../../models/header-state.model';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginResponse } from '../../../models/login-response.model';


@Component({
  selector: 'app-login-header',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css'],
})
export class LoginHeaderComponent implements OnInit, OnDestroy {
  @Input() isHeaderWhite = false;
  isPopupOpen = false;
  errorMsg = '';
  state!: HeaderState;
  private stateSub!: Subscription;
  private removeClickListener: () => void = () => {};

  constructor(
    public headerService: HeaderService,
    private el: ElementRef,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.stateSub = this.headerService.state$.subscribe((state) => {
      this.state = state;
    });

    this.removeClickListener = this.renderer.listen('document', 'mousedown', this.handleClickOutside);
  }

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
    this.removeClickListener();
  }

  handleClickOutside = (e: MouseEvent) => {
    setTimeout(() => {
      const popup = this.el.nativeElement.querySelector('.popup');
      if (this.isPopupOpen && popup && !popup.contains(e.target as Node)) {
        this.isPopupOpen = false;
      }
    }, 0);
  };

  togglePopup(event?: MouseEvent) {
    event?.stopPropagation();
    this.isPopupOpen = !this.isPopupOpen;
  }

  handleLogin(form: NgForm) {
    const { username, password } = form.value;
    this.http
      .post<LoginResponse>('/api/admin/login', { username, password })
      .subscribe({
        next: (res) => {
          this.headerService.setLoggedIn(res.user);
          this.isPopupOpen = false;
          this.errorMsg = '';
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Login failed';
        },
      });
  }

  handleLogout() {
    this.headerService.logout();
  }
}
