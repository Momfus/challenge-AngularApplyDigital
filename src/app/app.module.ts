import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/angular.material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { PostListsComponent } from './pages/post-lists/post-lists.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostCardComponent } from './shared/post-card/post-card.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostListsComponent,
    NotFoundComponent,
    PostCardComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    InfiniteScrollModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
