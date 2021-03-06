import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbsFileSelectComponent } from './file-select/file-select.component';
import {MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonPipesModule} from '../../pipes/common-pipes.module';
import { EbsFileUploadComponent } from './file-upload/file-upload.component';

export {EbsFileSelectComponent} from './file-select/file-select.component';
export {EbsFileUploadComponent} from './file-upload/file-upload.component';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule, MatListModule,

    MatButtonModule, MatIconModule,

    MatProgressBarModule,

    CommonPipesModule
  ],
  declarations: [
    EbsFileSelectComponent,
    EbsFileUploadComponent
  ],
  exports: [
    EbsFileSelectComponent,
    EbsFileUploadComponent
  ]
})
export class EbsFilesModule { }
