import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ISEO } from '../models/interfaces';
@Injectable()
export class SeoService {

  constructor(private meta: Meta, private title: Title) {

   }

  generateTags(config: ISEO) {
    // default values
   

this.meta.updateTag({ name: 'twitter:card', content: config.summary });
this.meta.updateTag({ name: 'twitter:site', content: config.site });
this.meta.updateTag({ name: 'twitter:title', content: config.title });
this.meta.updateTag({ name: 'twitter:description', content: config.description });
this.meta.updateTag({ name: 'twitter:image', content: config.image });

this.meta.updateTag({ property: 'og:type', content: config.type });
this.meta.updateTag({ property: 'og:site_name', content: config.site_name });
this.meta.updateTag({ property: 'og:title', content: config.title });
this.meta.updateTag({ property: 'og:description', content: config.description });
this.meta.updateTag({ property: 'og:image', content: config.image });
this.meta.updateTag({ property: 'og:url', content: `https://bashbash.io/${config.slug}` });
}



updateTile(){
  this.title.setTitle('');
}

}