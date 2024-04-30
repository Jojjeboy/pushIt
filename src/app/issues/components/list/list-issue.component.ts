import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubIssueService } from '../../service/github-issue.service';
import { strings as englishStrings } from "ngx-timeago/language-strings/en";

@Component({
  selector: 'app-list',
  templateUrl: './list-issue.component.html',
  styleUrl: './list-issue.component.scss'
})
export class ListIssuesComponent implements OnInit{
  protected issues: any = [];
  repositoryUrl: string = 'https://api.github.com/repos/Jojjeboy/pushIt/issues?per_page=10000';
  issueFetched: boolean = false;


  constructor(private githubService: GithubIssueService) {}

  ngOnInit() {
    this.getIssues(this.repositoryUrl);
  }

  /**
   * Get all issues available for the passed url
   *
   * @param url: string - optional URL to fetch issues from.
   */
  getIssues(url: string): void {
    this.githubService.getIssues(url).subscribe((data) => {
      this.issueFetched = true;
      console.log(data.body)
      this.issues = data.body;
    });
  }


}
