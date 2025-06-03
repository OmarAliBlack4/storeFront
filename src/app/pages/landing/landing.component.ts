import { Component } from '@angular/core';
import { HeroSectionComponent } from "../hero-section/hero-section.component";
import { ProductsComponent } from "../products/products.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroSectionComponent, ProductsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
