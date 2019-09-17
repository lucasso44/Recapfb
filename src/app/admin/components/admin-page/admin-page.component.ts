import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  user: User = new User();

  constructor(
    private authService: AuthService) {
    }

  ngOnInit() {
    this.authService.signin('lucaslawes@gmail.com', 'Creative1!!')
    .then(() => {
      console.log('Logged in as Lucas');
      this.authService.currentUser.subscribe(user => this.user = user);
    });
  }

}
