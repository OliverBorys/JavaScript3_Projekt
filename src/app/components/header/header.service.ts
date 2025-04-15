import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  private get state(): HeaderState {
    return this.stateSubject.getValue();
  }

  private setState(newState: Partial<HeaderState>) {
    this.stateSubject.next({ ...this.state, ...newState });
  }

  setLoggedIn(user: any) {
    localStorage.setItem('adminUser', JSON.stringify(user));
    this.setState({ user, isLoggedIn: true });
  }

  logout() {
    localStorage.removeItem('adminUser');
    this.setState({ user: null, isLoggedIn: false });
  }

  setScrolled(scrolled: boolean) {
    this.setState({ isScrolled: scrolled });
  }

  setHovered(hovered: boolean) {
    this.setState({ isHovered: hovered });
  }

  toggleSidebar(force?: boolean) {
    this.setState({ isSidebarOpen: force ?? !this.state.isSidebarOpen });
  }

  toggleCart(force?: boolean) {
    this.setState({ isCartOpen: force ?? !this.state.isCartOpen });
  }
}
