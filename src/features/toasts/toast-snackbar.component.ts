import {Component, Injectable, OnInit} from '@angular/core';
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {Subscription} from "rxjs";
import {ToastService} from "../toasts/toast.service";
import {Toast} from "../toasts/toast";

@Component({
  selector: 'app-toast',
  template: ''

})
export class ToastSnackbarComponent implements OnInit{


  private subscription: Subscription;

  constructor(private toastService: ToastService,
              public snackBar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.subscription = this.toastService.getNotificationsObservable().subscribe(
      (notification: Toast) => {
        this.snackBar.open(notification.message, "OK", <MdSnackBarConfig>{duration: 3000});
      }
    )
  }
}
