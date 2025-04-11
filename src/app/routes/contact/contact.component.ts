import { Component } from '@angular/core';
import { ContactAccordionComponent } from '../../components/contact/contact-accordion.component';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [ContactAccordionComponent]
})
export class ContactComponent {
  ngOnInit(): void {
    document.title = 'Contact';
  }
}
