import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Hit } from '../../models/post.model';
import { PostResultsSearch } from '../../models/post-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TechTypeOption } from '../../models/tech-type-option.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit {

  posts: Hit[] = [];
  isLoadingScrolling: boolean = false; // Extra helper for the infinite scroller trigger event


  technologyTypes: TechTypeOption[] = [
    {value: '', viewValue: 'Any', icon: ''},
    {value: 'angular', viewValue: 'Angular', icon: 'assets/logos/angular-logo.png'},
    {value: 'reactjs', viewValue: 'ReactJs', icon: 'assets/logos/react-logo.png'},
    {value: 'vuejs', viewValue: 'VueJs', icon: 'assets/logos/vue-logo.png'}
  ]

  selectedTechType: TechTypeOption = this.technologyTypes[0];

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.loadPostsFromApi(20);
  }

  loadPostsFromApi( perPage: number = 10, technologyFilter='') {
    this.isLoadingScrolling = true;
    this.postService.getPosts(perPage,technologyFilter).subscribe(
      {

        next: ( (res: PostResultsSearch) => {
          console.log(res.hits);
          this.posts = [...this.posts, ...res.hits];
        }),
        error: (error: string) => {
          this.showErrorSnackBar(error);
        },
        complete: () => {
          this.isLoadingScrolling = false;
        }

      })

  }


  showErrorSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onScroll() {
    if( !this.isLoadingScrolling ) {
      this.loadPostsFromApi();
    }
  }

  onFilterTechnologyChange() {


    this.posts = [];
    this.postService.resetSerch();
    this.loadPostsFromApi( 20, this.selectedTechType.value);

  }

}
