import { eventHandler } from 'h3'
import type { MediaPost } from '../../../app/types/provider/mediaPost'

export const mediaPosts: MediaPost[] = [
  {
    id: 1,
    title: 'How to Build a Consistent Morning Wellness Routine',
    type: 'video',
    description: 'A step-by-step guide to creating a powerful morning routine that includes movement, mindfulness, and nutrition habits.',
    publishedDate: '2026-07-01',
    views: 4820,
    likes: 312,
    comments: 47,
    duration: '14:32',
    status: 'published',
    tags: ['wellness', 'morning', 'habits']
  },
  {
    id: 2,
    title: "The Science of Stress: Understanding Your Body's Response",
    type: 'podcast',
    description: 'In this episode, we deep-dive into how chronic stress affects your hormones, immune system, and long-term health — and what you can do about it.',
    publishedDate: '2026-06-24',
    views: 2910,
    likes: 189,
    comments: 31,
    duration: '42:17',
    status: 'published',
    tags: ['stress', 'science', 'health']
  },
  {
    id: 3,
    title: '5 Nutrition Myths Debunked by a Registered Dietitian',
    type: 'article',
    description: 'We bust the most common nutrition myths that are holding people back from their health goals, backed by the latest research.',
    publishedDate: '2026-06-18',
    views: 7340,
    likes: 504,
    comments: 93,
    readTime: '6 min',
    status: 'published',
    tags: ['nutrition', 'myths', 'diet']
  },
  {
    id: 4,
    title: 'Corporate Wellness 101: How to Get Leadership Buy-In',
    type: 'article',
    description: 'A practical guide for HR managers and wellness champions on building the business case for a workplace wellness program.',
    publishedDate: '2026-06-10',
    views: 3210,
    likes: 228,
    comments: 42,
    readTime: '8 min',
    status: 'published',
    tags: ['corporate', 'leadership', 'wellness']
  },
  {
    id: 5,
    title: 'Breathwork for Anxiety Relief — Live Demo',
    type: 'video',
    description: 'Join me for a live 10-minute guided breathwork session designed to calm the nervous system and reduce acute anxiety.',
    publishedDate: '2026-07-05',
    views: 9100,
    likes: 840,
    comments: 118,
    duration: '10:05',
    status: 'published',
    tags: ['breathwork', 'anxiety', 'live']
  },
  {
    id: 6,
    title: 'EP. 12 — Gut Health with Dr. Maya Torres',
    type: 'podcast',
    description: 'Functional medicine expert Dr. Torres shares how gut microbiome health connects to mental clarity, mood, and energy.',
    publishedDate: '2026-07-08',
    views: 1540,
    likes: 102,
    comments: 18,
    duration: '58:43',
    status: 'published',
    tags: ['gut-health', 'microbiome', 'interview']
  },
  {
    id: 7,
    title: 'Sleep Optimization: The 4 Pillars of Deep Rest',
    type: 'article',
    description: 'Discover the four key factors that determine sleep quality and evidence-based strategies to optimize each one.',
    publishedDate: '2026-05-30',
    views: 5870,
    likes: 413,
    comments: 67,
    readTime: '10 min',
    status: 'published',
    tags: ['sleep', 'recovery', 'optimization']
  },
  {
    id: 8,
    title: 'Mindfulness at Work: A Corporate Training Preview',
    type: 'video',
    description: 'An exclusive sneak peek into our corporate mindfulness workshop — techniques your team can use immediately in the office.',
    publishedDate: '2026-07-10',
    views: 620,
    likes: 57,
    comments: 9,
    duration: '8:15',
    status: 'draft',
    tags: ['mindfulness', 'corporate', 'preview']
  },
  {
    id: 9,
    title: 'EP. 13 — Building Resilience Through Physical Training',
    type: 'podcast',
    description: 'Sports psychologist and strength coach discusses how physical challenges build mental toughness and emotional regulation.',
    publishedDate: '2026-07-15',
    views: 0,
    likes: 0,
    comments: 0,
    duration: '51:20',
    status: 'draft',
    tags: ['resilience', 'fitness', 'mental-health']
  },
  {
    id: 10,
    title: 'Plant-Based Meal Prep for Busy Professionals',
    type: 'article',
    description: 'Quick, delicious, and nutrient-dense plant-based meal prep ideas that take less than 30 minutes on a Sunday.',
    publishedDate: '2026-05-12',
    views: 11200,
    likes: 920,
    comments: 145,
    readTime: '7 min',
    status: 'archived',
    tags: ['plant-based', 'meal-prep', 'nutrition']
  }
]

export default eventHandler(() => mediaPosts)
