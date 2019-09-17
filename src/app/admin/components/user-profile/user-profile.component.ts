import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;
  pathways: Pathway[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private pathwayService: PathwayService
  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.getUser();
  }

  getUser(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    this.userService.getUser(uid).subscribe(user => {
      this.user = user;
      this.pathwayService.getPathways(this.user.uid).subscribe(pathways => {
        this.pathways = pathways;
      });
    });
  }

}
