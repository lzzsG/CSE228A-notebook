import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/CSE228A-notebook/',
  title: "Lzzs CSE 228A",
  description: "A VitePress Site ,for Lzzs CSE228A Notebook",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: 'Home', link: 'https://lzzs.fun' },
      { text: 'Blog', link: 'https://lzzs.fun/blog' },
      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     {
      //       text: 'Item A1', items: [
      //         { text: 'Section A Item A', link: '/item-3' }]
      //     },
      //     { text: 'Item B', link: '/item-3' },
      //     { text: 'Item C', link: '/item-3' }
      //   ]
      // },
    ],

    logo: '/favicon.svg',  // 替换为你的logo
    // siteTitle: '----',  // 可自定义标题，不设置则默认为title

    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Lzz'
    },
    sidebar: [
      {
        text: 'Lzzs CSE 228A Notebook',
        items: [
          { text: '开始', link: '/' },
          { text: 'L01 Course Introduction', link: '/L01-Course-Introduction' },
          { text: 'L02 Hello Chisel', link: '/L02-Hello-Chisel' },
          { text: 'L03 Combinational Logic', link: '/L03-Combinational-Logic' },
          { text: 'L04 Sequential Circuits', link: '/L04-Sequential-Circuits' },
        ]
      }, {
        text: '以下部分未完成',
        items: [
          { text: 'L05 Collections', link: '/L05-Collections' },
          { text: 'L06 Encapsulation', link: '/L06-Encapsulation' },
          { text: 'L07 Decoupling', link: '/L07-Decoupling' },
          { text: 'L08 Arbitration', link: '/L08-Arbitration' },
          { text: 'L09 Testing', link: '/L09-Testing' },
          { text: 'L10 Testing (cont.) + FP Intro', link: '/L10-Testing-Cont-FP-Intro' },
          { text: 'L11 FP (cont.)', link: '/L11-FP-Cont' },
          { text: 'L12 FP (conc.) + Pattern Matching', link: '/L12-FP-Conc-Pattern-Matching' },
          { text: 'L13 Queue Design Case Study', link: '/L13-Queue-Design-Case-Study' },
          { text: 'L14 Inheritance', link: '/L14-Inheritance' },
          { text: 'L15 Network Design Case Study', link: '/L15-Network-Design-Case-Study' },
          { text: 'L16 Design Opt. Intro + Memory', link: '/L16-Design-Opt-Intro-Memory' },
          { text: 'Guest Lecture - Jose Renau - Pyrope', link: '/Guest-Lecture-Jose-Renau-Pyrope' },
          { text: 'Project Group Meetings', link: '/Project-Group-Meetings' },
          { text: 'Guest Lecture - Kevin Laeufer - Formal Verification in Chisel', link: '/Guest-Lecture-Kevin-Laeufer-Formal-Verification' },
          { text: 'L17 Optimizing Delay', link: '/L17-Optimizing-Delay' },
          { text: 'L18 Power + Design Space Exploration', link: '/L18-Power-Design-Space-Exploration' },
          { text: 'L19 Open-source Project Dev.', link: '/L19-Open-source-Project-Dev' },
          { text: 'L20 Chisel Grab Bag', link: '/L20-Chisel-Grab-Bag' },
          { text: 'L21 FIRRTL', link: '/L21-FIRRTL' },
          { text: 'Project Group Presentations', link: '/Project-Group-Presentations' },
          { text: 'Markdown Examples1', link: '/markdown/md1' },
          { text: 'Markdown Examples2', link: '/markdown/md2' },
        ]
      },
      // {
      //   text: 'Examples1',
      //   items: [
      //     { text: 'Markdown Examples1', link: '/md1' },
      //     { text: 'Markdown Examples2', link: '/markdown-examples3' },
      //     { text: 'Runtime API Examples', link: '/api-examples3' },
      //   ]
      // },
      // {
      //   text: 'Examples2',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples2' },
      //     {
      //       text: 'Runtime API Examples', items: [
      //         {
      //           text: 'Markdown Examples', items: [
      //             { text: 'Markdown Examples1', link: '/markdown-examples' },
      //             { text: 'Runtime API Examples', link: '/api-examples' }
      //           ]
      //         },
      //         { text: 'Runtime API Examples', link: '/api-examples1' }
      //       ]
      //     }
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lzzsG/CSE228A-notebook' }
    ],
    search: {
      provider: 'local'
    }

  },
  rewrites: {
    // 'md': '1/md',  // 在这重定向
  },
  cleanUrls: true,
  markdown: {
    // math: true   // 数学公式，需要 npm add -D markdown-it-mathjax3

  }
})
