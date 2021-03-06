import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Subscription} from 'rxjs';
import {ToastService} from './toast.service';
import {Toast} from './toast';

@Component({
  selector: 'app-toast',
  template: ''

})
export class ToastSnackbarComponent implements OnInit {


  private subscription: Subscription;

  constructor(private toastService: ToastService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.subscription = this.toastService.getNotificationsObservable().subscribe(
      (notification: Toast) => {
        this.snackBar.open(notification.message, 'OK', <MatSnackBarConfig>{duration: 3000});
      }
    );
  }
}
