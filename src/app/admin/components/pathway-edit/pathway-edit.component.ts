import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, concat, of, from } from 'rxjs';
import { User } from 'src/app/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { finalize, debounceTime, distinctUntilChanged, switchMap, tap, catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Video } from 'src/app/model/video';
import { convertSnaps } from 'src/app/core/utils';

@Component({
  selector: 'app-pathway-edit',
  templateUrl: './pathway-edit.component.html',
  styleUrls: ['./pathway-edit.component.scss']
})
export class PathwayEditComponent implements OnInit {

  pathwayEditForm: FormGroup;
  user: User = new User();
  pathway: Pathway = new Pathway();
  pathwayId: string;
  uploadPercent$: Observable<number>;

  videos$: Observable<Video[]>;
  videoLoading = false;
  videoInput$ = new Subject<string>();
  selectedVideos: Video[] = [];

  selectedCompanies;
  companies: any[] = [];
  companiesNames = ['Uber', 'Microsoft', 'Flexigen'];

  courses: any[] = [
    {title: 'Accounting & Finance BSc(Hons)'},
    {title: 'Adult Nursing BSc(Hons)'},
    {title: 'Aerospace Engineering MEng/BEng(Hons)'},
    {title: 'Aircraft Engineering BEng(Hons)'},
    {title: 'Aircraft Engineering BEng(Hons) top-up'},
    {title: 'Architecture BA(Hons)'},
    {title: 'Art & Design Foundation Diploma'},
    {title: 'Art & Design History & Practice BA(Hons)'},
    {title: 'Art Direction'},
    {title: 'Aviation Operations with Commercial Pilot'},
    {title: 'Biochemistry BSc(Hons)'},
    {title: 'Biological Sciences BSc(Hons)'},
    {title: 'Biological Sciences BSc(Hons)'},
    {title: 'Biological Sciences BSc(Hons)'},
    {title: 'Biomedical Science BSc(Hons)'},
    {title: 'Building Surveying BSc(Hons)'},
    {title: 'Business Economics BSc(Hons)'},
    {title: 'Business HND'},
    {title: 'Business Management BSc(Hons)'},
    {title: 'Business Management Practice'},
    {title: 'Chemistry BSc(Hons)'},
    {title: 'Chemistry MChem(Hons)'},
    {title: 'Children\'s Nursing BSc(Hons)'},
    {title: 'Civil and Infrastructure Engineering'},
    {title: 'Computer Games Programming BSc(Hons)'},
    {title: 'Computer Science BSc(Hons)'},
    {title: 'Computing and Mathematics Foundation Year'},
    {title: 'Construction Management BSc(Hons)'},
    {title: 'Creative Writing & Film Cultures BA(Hons)'},
    {title: 'Criminology and Forensic Psychology'},
    {title: 'Criminology and International Relations'},
    {title: 'Criminology and Sociology BSc(Hons)'},
    {title: 'Criminology BSc(Hons)'},
    {title: 'Curation, Exhibition and Events BA(Hons)'},
    {title: 'Cyber Security and Computer Forensics'},
    {title: 'Dance & Drama BA(Hons)'},
    {title: 'Dance BA(Hons)'},
    {title: 'Design Marketing BA(Hons)'},
    {title: 'Digital Business BSc(Hons)'},
    {title: 'Digital Media Technology BSc(Hons)'},
    {title: 'Drama & Creative Writing BA(Hons)'},
    {title: 'Drama & English BA(Hons)'},
    {title: 'Drama & Film Cultures BA(Hons)'},
    {title: 'Drama BA(Hons)'},
    {title: 'Early Years FdA foundation degree'},
    {title: 'Early Years: Education & Leadership in'},
    {title: 'Early Years: Leadership & Management'},
    {title: 'Early Years: Teaching & Learning'},
    {title: 'Economics BSc(Hons)'},
    {title: 'Education BA(Hons)'},
    {title: 'Engineering Foundation Year'},
    {title: 'Engineering Foundation Year'},
    {title: 'English & Creative Writing BA(Hons)'},
    {title: 'English & History BA(Hons)'},
    {title: 'English Language & Linguistics BA(Hons)'},
    {title: 'English Literature BA(Hons)'},
    {title: 'English, History and Creative Writing'},
    {title: 'Entrepreneurship & Innovation'},
    {title: 'Environmental Science BSc(Hons)'},
    {title: 'Fashion BA(Hons)'},
    {title: 'Film Cultures BA(Hons)'},
    {title: 'Filmmaking BA(Hons)'},
    {title: 'Financial Economics BSc(Hons)'},
    {title: 'Fine Art & Art History BA(Hons)'},
    {title: 'Fine Art BA(Hons)'},
    {title: 'Forensic Psychology BSc(Hons)'},
    {title: 'Forensic Science BSc(Hons)'},
    {title: 'Foundation Year in Business'},
    {title: 'Geography BA(Hons)/BSc(Hons)'},
    {title: 'Global Politics & International Relations'},
    {title: 'Graphic Design BA(Hons)'},
    {title: 'Healthcare Practice (Associate Practitioner)'},
    {title: 'Healthcare Practice (Nursing Associate)'},
    {title: 'Healthcare Practice DipHE and BSc(Hons)'},
    {title: 'Historic Building Conservation'},
    {title: 'History and International Relations BA(Hons)'},
    {title: 'History BA(Hons)'},
    {title: 'Human Geography BA(Hons)'},
    {title: 'Human Rights and Criminology BA(Hons)'},
    {title: 'Human Rights and History (BA)Hons'},
    {title: 'Human Rights and Social Justice BA(Hons)'},
    {title: 'Human Rights and Sociology BA(Hons)'},
    {title: 'Humanities and Arts Foundation Year'},
    {title: 'Humanities and Arts Foundation Year'},
    {title: 'Humanities and Arts Foundation Year'},
    {title: 'Illustration Animation BA(Hons)'},
    {title: 'Interior Design BA(Hons)'},
    {title: 'International Business BSc(Hons)'},
    {title: 'International Law with Professional Experience'},
    {title: 'Journalism and Media BA(Hons)'},
    {title: 'Journalism BA(Hons)'},
    {title: 'Law with Professional Experience LLB(Hons)'},
    {title: 'Learning Disability Nursing BSc(Hons)'},
    {title: 'Management BSc(Hons)'},
    {title: 'Marketing & Advertising BSc(Hons)'},
    {title: 'Mathematics and Computing Foundation Year'},
    {title: 'Mathematics BSc(Hons)'},
    {title: 'Mechanical Engineering (Automotive)'},
    {title: 'Mechanical Engineering MEng/BEng(Hons)'},
    {title: 'Media & Communication BA(Hons)'},
    {title: 'Media & Global Politics BA(Hons)'},
    {title: 'Mental Health Nursing BSc(Hons)'},
    {title: 'Midwifery/Registered Midwife'},
    {title: 'Midwifery/Registered Midwife BSc(Hons)'},
    {title: 'Music Technology BA(Hons)'},
    {title: 'Nutrition (Exercise and Health) BSc(Hons)'},
    {title: 'Nutrition (Human Nutrition) BSc(Hons)'},
    {title: 'Occupational Therapy BSc(Hons)'},
    {title: 'Paramedic Practice BSc(Hons)'},
    {title: 'Paramedic Science BSc(Hons)'},
    {title: 'Pharmaceutical & Chemical Sciences'},
    {title: 'Pharmaceutical Science BSc(Hons)'},
    {title: 'Pharmaceutical Science MPharmSci(Hons)'},
    {title: 'Pharmacology BSc(Hons)'},
    {title: 'Pharmacy MPharm(Hons)'},
    {title: 'Photography BA(Hons)'},
    {title: 'Physical Education, Sport & Activity PESA FdA'},
    {title: 'Physiotherapy BSc(Hons)'},
    {title: 'Popular Music BA(Hons)'},
    {title: 'Practice FdA foundation degree'},
    {title: 'Primary Teaching leading to QTS BA(Hons)'},
    {title: 'Product & Furniture Design BA(Hons)'},
    {title: 'Psychology BSc(Hons)'},
    {title: 'Psychology with Criminology BSc(Hons)'},
    {title: 'Psychology with Sociology BSc(Hons)'},
    {title: 'Publishing BA(Hons)'},
    {title: 'Quantity Surveying Consultancy BSc(Hons)'},
    {title: 'Radiography, Diagnostic BSc(Hons)'},
    {title: 'Radiography, Therapeutic BSc(Hons)'},
    {title: 'Real Estate Management BSc(Hons)'},
    {title: 'Science Foundation Year'},
    {title: 'Science Foundation Year'},
    {title: 'Social Sciences Foundation Year'},
    {title: 'Social Sciences Foundation Year'},
    {title: 'Social Work BA(Hons)'},
    {title: 'Sociology and International Relations'},
    {title: 'Sociology BSc(Hons)'},
    {title: 'Space Technology MEng/BEng(Hons)'},
    {title: 'Special Educational Needs & Inclusive'},
    {title: 'Special Educational Needs & Inclusive'},
    {title: 'Sport Coaching FdSc'},
    {title: 'Sport Science (Coaching) BSc(Hons)'},
    {title: 'Sport Science BSc(Hons)'},
    {title: 'Working with Children and Young People BA(Hons)'}
  ];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private pathwayService: PathwayService,
    private router: Router,
    private ngZone: NgZone,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.pathwayEditForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      selectedVideos: [''],
      selectedCompanies: ['']
    });
    this.authService.signinAsLucas().then(() => {
      const uid = this.authService.currentUserId;
      this.userService.getUser(uid).subscribe(user => {
        this.user = user;
      });
    });
    this.pathwayId = this.route.snapshot.paramMap.get('pid');
    this.pathwayService.get(this.pathwayId).subscribe(pathway => {
      this.pathwayEditForm.patchValue({
        title: pathway.title,
        description: pathway.description
      });
    });
    this.loadVideos();
    this.companiesNames.forEach((c, i) => {
      this.companies.push({ id: i, title: c });
    });
  }

  trackByFn(item: Video) {
    return item.id;
  }

  addTagFn(name: string) {
    return { title: name, tag: true };
  }

  get getSelectedVideos(): string {
    return this.pathwayEditForm.get('selectedVideos').value;
  }

  get getSelectedCompanies(): string {
    return this.pathwayEditForm.get('selectedCompanies').value;
  }

  private loadVideos() {
    this.videos$ = concat(
        of([]), // default items
        this.videoInput$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => this.videoLoading = true),
            switchMap(term => this.getVideos().pipe(
                catchError(() => of([])), // empty list on error
                tap(() => this.videoLoading = false)
            ))
        )
    );
  }

  getVideos(): Observable<Video[]> {
    return this.afs.collection(
        'videos',
            ref => ref.orderBy('order').where('pid', '==', this.pathwayId)
        )
        .snapshotChanges()
        .pipe(
            map(snaps => convertSnaps<Video>(snaps)));
  }

  uploadCourses() {
    return;
    this.courses.forEach((course, index) => {
      from(this.afs.collection(`courses`).add(course)).subscribe(c => {
        console.log(c);
      });
    });
  }

  save(closeForm: boolean): void {
    const changes = this.pathwayEditForm.value;
    console.log(this.pathway.id);
    if (this.pathway.id !== undefined) {
      this.pathwayService.update(
        this.pathway.id, {
        uid: this.user.uid,
        title: changes.title,
        description: changes.description,
        imageUrl: this.pathway.imageUrl || ''
      }).subscribe((docRef: DocumentReference) => {
          console.log('Updated user pathway');
          if (closeForm) {
            this.close();
          }
        });
    } else {
      this.pathwayService.add({
        uid: this.user.uid,
        title: changes.title,
        description: changes.description,
        imageUrl: this.pathway.imageUrl || ''
      }).subscribe((docRef: DocumentReference) => {
          console.log('Saved user pathway');
          this.pathway.id = docRef.id;
          if (closeForm) {
            this.close();
          }
        });
    }
  }

  uploadImage(event): void {
    this.save(false);
    const file: File = event.target.files[0];
    const filePath = `pathways/${this.pathway.id}/${file.name}`;
    const metadata = {
      contentType: 'image',
      cacheControl: 'public, max-age=31536000',
    };
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);
    this.uploadPercent$ = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
        const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
        fileRef.updateMetadata(metadata).subscribe();
        fileRef.getDownloadURL().subscribe(fileUrl => {
          this.pathwayService.update(this.pathway.id, { imageUrl: fileUrl })
          .subscribe(() => {
            this.pathway.imageUrl = fileUrl;
            console.log('Saved user pathway image url');
          });
        });
      })).subscribe();
  }

  close() {
    this.ngZone.run(() => this.router.navigate([`/admin/pathways`]));
  }
}

