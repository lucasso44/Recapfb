import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;
  hide = true;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });
  }

  ngOnInit() {
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  signIn() {
    return this.authService.signin(this.email.value, this.password.value)
      .then(user => {
          this.router.navigate(['/admin']);
      });
  }

}
