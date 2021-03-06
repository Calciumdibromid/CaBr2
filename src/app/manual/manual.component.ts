import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
})
export class ManualComponent implements OnInit {
  typescriptstuff = 'foo';

  constructor(public dialogRef: MatDialogRef<ManualComponent>) {}

  ngOnInit(): void {}
}
