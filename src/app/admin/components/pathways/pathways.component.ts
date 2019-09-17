import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { PathwayService } from 'src/app/services/pathway.service';
import { Pathway } from 'src/app/model/pathway';

@Component({
  selector: 'app-pathways',
  templateUrl: './pathways.component.html',
  styleUrls: ['./pathways.component.scss']
})
export class PathwaysComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['id', 'title', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(
    private pathwayService: PathwayService) {
    }

  ngOnInit() {
    this.pathwayService.getAllPathways().subscribe(pathways => this.dataSource.data = pathways);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  delete(pathway: Pathway) {
    this.pathwayService.delete(pathway.id).subscribe(() => {
      console.log(`Deleted pathway ${pathway.id}`);
    });
  }
}
