import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TagsService } from 'src/app/services/tags/tags.service';

@Component({
  selector: 'app-add-tag-modal',
  templateUrl: './add-tag-modal.component.html',
  styleUrls: ['./add-tag-modal.component.scss']
})
export class AddTagModalComponent implements OnInit {

  public tagForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddTagModalComponent>,
    private tagService: TagsService
  ) {
    this.tagForm = new FormGroup({
      tag: new FormControl('', Validators.required)
    })
   }

  ngOnInit(): void {
  }

  async createTag(){
    try {
      await this.tagService.createTag(this.tagForm.value).then(a => {
        this.dialogRef.close()
      })
    } catch (error) {
      console.log(error);
      
    }
  }

}
