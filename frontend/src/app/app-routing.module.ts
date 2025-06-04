import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      errorHandler: error => {
        window.location.href = '/';
      },
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
