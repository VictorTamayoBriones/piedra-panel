import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isAuth: any = false;

  constructor(private auth: AngularFireAuth){
  }

  async ngOnInit() {
    this.auth.authState.subscribe((auth) => {      
      this.isAuth = auth;
    });
  }

  title = 'piedra-panel';
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: any): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
