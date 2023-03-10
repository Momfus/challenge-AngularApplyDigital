import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  TechTypeOption,
  SearchType,
} from '../../models/tech-type-option.model';
import { FavsService } from '../../services/favs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css'],
})
export class PostListsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postFavList: Post[] = [];

  favsList$!: Subscription;

  isLoadingScrolling: boolean = true; // Extra helper for the infinite scroller trigger event

  selectedTechType: TechTypeOption = { value: '', viewValue: 'Any', icon: '' };

  searchType: SearchType['postFavs'] = 'all';

  constructor(
    private postService: PostService,
    private favsService: FavsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.selectedTechType = this.postService.loadFilterTechnologySearch(
      { value: '', viewValue: 'Any', icon: '' },
    );

    this.loadPostsFromApi(true, 20, this.selectedTechType.value);


    // Subscribe to the changes made in the localstorage fav list (first get the ones that already have)
    this.postFavList = this.favsService.getFavs();
    this.favsList$ = this.favsService.postFavoritesList$.subscribe( (list: Post[]) => {
      this.postFavList = list;
    });

  }

  ngOnDestroy(): void {

    this.favsList$.unsubscribe();

  }

  loadPostsFromApi(
    isNewData: boolean = true,
    perPage: number = 10,
    technologyFilter: string = ''
  ) {
    if (!isNewData && this.postService.postsListLength > 0) {
      this.posts = this.postService.postsList;
    } else {
      this.isLoadingScrolling = true;
      console.log(technologyFilter)
      this.postService.getPosts(perPage, technologyFilter).subscribe({
        next: (res: Post[]) => {
          this.posts = res;
        },
        error: (error: string) => {
          this.showErrorSnackBar(error);
        },
        complete: () => {
          this.isLoadingScrolling = false;
        },
      });
    }
  }

  loadPostsFromLocalStorage() {
    this.posts = this.postFavList
  }

  showErrorSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onScroll() {
    if (!this.isLoadingScrolling && this.searchType === 'all') {
      this.loadPostsFromApi(true);
    }
  }

  onFilterTechnologyChange() {

    this.postService.saveFilterTechnologySearch(this.selectedTechType);

    this.posts = [];
    this.postService.resetSerch();
    this.loadPostsFromApi(true, 20, this.selectedTechType.value);
  }

  onToggleSearchType(value: SearchType['postFavs']) {

    if (value === 'all') {
      this.loadPostsFromApi(false);
    } else {
      this.loadPostsFromLocalStorage();
    }

    this.searchType = value;

  }

  onPostLikedChange(post: Post) {

    if( post.liked ) {
      this.favsService.addPostToFavs(post);
    } else {
      this.favsService.removePostFromFavs(post.objectID);
    }

  }
}
