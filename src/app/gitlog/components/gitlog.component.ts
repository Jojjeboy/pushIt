import { Component, OnInit } from '@angular/core';
import { applicationversion } from  '../../../environments/applicationversion';
import { Appversion } from '../../shared/interface/appversion';
import { Gitlog } from 'src/app/shared/interface/gitlog';

@Component({
  selector: 'app-gitlog',
  templateUrl: './gitlog.component.html',
  styleUrl: './gitlog.component.scss'
})
export class GitlogComponent implements OnInit {

  protected appVersion: Appversion = applicationversion;
  protected gitlogs: string[] = [];
  protected gitObjs: Gitlog[] = [];

  ngOnInit(): void {
    this.gitlogs = this.appVersion.gitlog.split('\n');

    let arrOfObj: Gitlog[];

    this.gitlogs.forEach( (gitlog) => {
      
      let obj: Gitlog = {
        hash: gitlog.split(';')[0],
        description: gitlog.split(';')[1],
        date: new Date(gitlog.split(';')[2])
      }

      this.gitObjs.push(obj);
    });

    console.log(this.gitObjs);
  }

}
