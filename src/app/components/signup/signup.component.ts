import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  hide = true;
  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });
  }

  ngOnInit() {
  }

  get displayName() {
    return this.signUpForm.get('displayName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  signUp() {
    return this.authService.signup(this.displayName.value, this.email.value, this.password.value)
      .then(user => {
        if (this.signUpForm.valid) {
          this.router.navigate(['/']);
        }
      });
  }
}
