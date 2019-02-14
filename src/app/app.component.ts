import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as ml5 from 'src/assets/ml5.min.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public classifier;
  public isModelLoaded = false;
  public className = "";
  public probability = 0;
  @ViewChild("img") public img: ElementRef;
  constructor(private cdref: ChangeDetectorRef) {}
  ngOnInit() {
    this.classifier = ml5.imageClassifier('MobileNet', () => {
      this.isModelLoaded = true;
    });
  }

  btnClick(fileEl: HTMLInputElement) {
    const file = fileEl.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (readerEvent) => {
      const data = readerEvent.target["result"];
      const URL = 'data:image/jpg;base64,'+ btoa(data);
      const imgTag = document.createElement("img");
      imgTag.src = URL;
      this.getResult(imgTag);
    }
  }

  getResult(data: HTMLImageElement) {
    this.classifier.predict(data, (err, results) => {
      if (!err) {
        this.className = JSON.parse(JSON.stringify(results[0].className));
        this.probability = JSON.parse(JSON.stringify(results[0].probability));
        this.img.nativeElement.innerHTML = data.outerHTML;
        this.cdref.detectChanges();
      }
    });
  }
}
