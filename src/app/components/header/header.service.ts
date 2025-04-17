import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface HeaderState {
  isLoggedIn: boolean;
  user: any;
  isScrolled: boolean;
  isHovered: boolean;
  isSidebarOpen: boolean;
  isCartOpen: boolean;
}

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private initialState: HeaderState = {
    isLoggedIn: localStorage.getItem('adminUser') !== null,
    user: JSON.parse(localStorage.getItem('adminUser') || 'null'),
    isScrolled: false,
    isHovered: false,
    isSidebarOpen: false,
    isCartOpen: false
  };

  private stateSubject = new BehaviorSubject<HeaderState>(this.initialState);
  state$ = this.stateSubject.asObservable();

  // Subject för att notifiera komponenter om att varukorgen har ändrats
  private cartChangedSubject = new Subject<void>();
  cartChanged$ = this.cartChangedSubject.asObservable();

  private get state(): HeaderState {
    return this.stateSubject.getValue();
  }

  private setState(newState: Partial<HeaderState>) {
    this.stateSubject.next({ ...this.state, ...newState });
  }

  // Auth-related

  setLoggedIn(user: any) {
    localStorage.setItem('adminUser', JSON.stringify(user));
    this.setState({ user, isLoggedIn: true });
  }

  logout() {
    localStorage.removeItem('adminUser');
    this.setState({ user: null, isLoggedIn: false });
  }

  // UI state toggles

  setScrolled(scrolled: boolean) {
    this.setState({ isScrolled: scrolled });
  }

  setHovered(hovered: boolean) {
    this.setState({ isHovered: hovered });
  }

  toggleSidebar(force?: boolean) {
    this.setState({ isSidebarOpen: force ?? !this.state.isSidebarOpen });
  }

  // CART logic

  toggleCart(force?: boolean): void {
    this.setState({ isCartOpen: force ?? !this.state.isCartOpen });
  }

  openCart(): void {
    this.toggleCart(true);
  }

  closeCart(): void {
    this.toggleCart(false);
  }

  openCartTemporarily(duration: number = 3000): void {
    this.openCart();
    setTimeout(() => this.closeCart(), duration);
  }

  notifyCartChanged(): void {
    this.cartChangedSubject.next();
  }
}
