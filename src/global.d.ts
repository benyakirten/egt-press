/// <reference types="@sveltejs/kit" />

interface IBook {
    title: string;
    author: string;
    image: string;
    pubDate: Date;
    desc: string;
    link: string;
    publisher: 'English Garden Talk Press' | 'Saint Bridged Vineyard Press';
    printedIsbn?: string;
    ebookIsbn?: string;
    audience: 'Children' | 'Teens' | 'Adults';
    keywords: string[];
}

interface IPerson {
    name: string;
    image: string;
    bio: string;
    books?: string[];
}

type ImagePosition = 'primary' | 'secondary';
type AnimationDirection = 'right' | 'left';
type SvelteAnimation = (node: Element, { delay, duration, easing }?: FadeParams) => TransitionConfig