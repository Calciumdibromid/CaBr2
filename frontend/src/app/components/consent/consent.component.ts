import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements OnInit {
  timer = this.data.duration;

  constructor(
    public readonly dialogRef: MatDialogRef<ConsentComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: { duration: number },
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1;
      }
    }, 1000);
  }
}
