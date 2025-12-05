import { Component, OnInit } from '@angular/core';
import { Filter } from '@model/filters/filter';
import { SaveSearchService } from '@services/saveSearch.service';

@Component({
  selector: 'app-showfilter',
  templateUrl: './showfilter.component.html',
  styleUrls: ['./showfilter.component.css']
})
export class ShowfilterComponent implements OnInit {

  filters: Filter[] = [];

  constructor(private saveSearchService: SaveSearchService) { 
    this.filters = this.saveSearchService.getSavedItems();
  } 

  ngOnInit() {
  }

}
