import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowRight, ArrowUp, Menu, X } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: '课程', href: '#works' },
  { label: '课堂', href: '#studio' },
  { label: '家长须知', href: '#journal' },
  { label: '报名', href: '#contact' },
];

const featuredWorks = [
  {
    title: '4-6 岁启蒙班',
    meta: '认识颜色、线条和形状',
    year: '适合第一次接触画画的孩子',
    image: '/assets/malaysia-art-class.png',
    alt: 'Malaysian art teacher guiding young children painting in a warm classroom.',
  },
  {
    title: '7-12 岁创作班',
    meta: '水彩、丙烯、观察和主题创作',
    year: '让孩子学会表达自己的想法',
    image: '/assets/kids-watercolor.png',
    alt: 'Children painting with watercolor on a tidy art table.',
  },
  {
    title: '周末体验课',
    meta: '先来试一堂，再决定要不要报名',
    year: '家长可以先了解孩子喜不喜欢',
    image: '/assets/kids-art-wall.png',
    alt: 'Warm classroom wall displaying colorful children artwork.',
  },
];

const studioNotes = [
  {
    title: '先认识主题',
    body: '从动物、花草、节日或生活小故事开始，让孩子有话可画。',
    image: '/assets/class-theme-intro.png',
    alt: 'Teacher introducing a colorful drawing topic to children in art class.',
  },
  {
    title: '老师一步步示范',
    body: '先看老师怎么做，再让孩子自己试，不急着画得完美。',
    image: '/assets/teacher-brush-demo.png',
    alt: 'Teacher demonstrating brush strokes beside a child.',
  },
  {
    title: '孩子自己动手画',
    body: '保留孩子自己的想法，老师在旁边提醒技巧和鼓励表达。',
    image: '/assets/child-independent-painting.png',
    alt: 'Child focused on painting independently in class.',
  },
  {
    title: '带着作品回家',
    body: '每次完成一张作品，让孩子看见自己的进步和成就感。',
    image: '/assets/child-proud-artwork.png',
    alt: 'Child proudly holding a finished colorful painting.',
  },
];

const journalItems = [
  {
    label: '年龄',
    title: '适合几岁孩子？',
    body: '建议 4-12 岁。年龄小的孩子从颜色和形状开始，大一点的孩子会加入构图和创作主题。',
    image: '/assets/age-group-class.png',
    alt: 'Children of different ages working at small tables in art class.',
  },
  {
    label: '小班',
    title: '一班多少人？',
    body: '小班教学，老师能看到每个孩子的进度。害羞或慢热的孩子也会被照顾到。',
    image: '/assets/small-class-size.png',
    alt: 'Small art class with five children around one table.',
  },
  {
    label: '体验',
    title: '可以先试课吗？',
    body: '可以。先预约一堂体验课，看看孩子喜不喜欢环境、老师和上课方式。',
    image: '/assets/trial-class-ready.png',
    alt: "Art studio prepared for a children's trial class.",
  },
];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const HEADER_SCROLL_OFFSET = 92;
const ANCHOR_SCROLL_DURATION = 650;
let activeScrollFrame = 0;

function scrollToHash(hash: string) {
  const targetId = hash.slice(1);
  const target = document.getElementById(targetId);

  if (!target) {
    window.location.hash = hash;
    return;
  }

  if (activeScrollFrame) {
    window.cancelAnimationFrame(activeScrollFrame);
  }

  const startY = window.scrollY;
  const targetY =
    targetId === 'home'
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET);
  const distance = targetY - startY;

  window.history.pushState(null, '', hash);

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = window.performance.now();

  const animate = (time: number) => {
    const progress = Math.min(1, (time - startTime) / ANCHOR_SCROLL_DURATION);
    const eased = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(animate);
      return;
    }

    activeScrollFrame = 0;
  };

  activeScrollFrame = window.requestAnimationFrame(animate);
}

function handleAnchorClick(
  event: ReactMouseEvent<HTMLAnchorElement>,
  href: string,
  afterClick?: () => void,
) {
  if (!href.startsWith('#')) {
    return;
  }

  event.preventDefault();
  afterClick?.();
  scrollToHash(href);
}

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const fadeDuration = 0.5;
    let frameId = 0;
    let resetTimer: number | undefined;

    const setOpacity = (opacity: number) => {
      video.style.opacity = String(Math.max(0, Math.min(1, opacity)));
    };

    const tick = () => {
      const { currentTime, duration } = video;

      if (Number.isFinite(duration) && duration > 0) {
        const remaining = duration - currentTime;
        let nextOpacity = 1;

        if (currentTime < fadeDuration) {
          nextOpacity = currentTime / fadeDuration;
        } else if (remaining < fadeDuration) {
          nextOpacity = remaining / fadeDuration;
        }

        setOpacity(nextOpacity);
      }

      frameId = requestAnimationFrame(tick);
    };

    const restartVideo = () => {
      setOpacity(0);

      resetTimer = window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => {
          setOpacity(0);
        });
      }, 100);
    };

    setOpacity(0);
    video.addEventListener('ended', restartVideo);
    frameId = requestAnimationFrame(tick);
    void video.play().catch(() => {
      setOpacity(0);
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resetTimer);
      video.removeEventListener('ended', restartVideo);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[300px] z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover object-center opacity-0 [filter:saturate(0.62)_contrast(0.92)_brightness(1.08)]"
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const menuColors = ['bg-[#ffe8a8]', 'bg-[#cfefff]', 'bg-[#ffd6cc]', 'bg-[#d9f4c7]', 'bg-[#eadcff]'];

  return (
    <header className="sticky inset-x-0 top-0 z-30 border-b border-foreground/10 bg-white/72 px-6 py-4 backdrop-blur-xl md:px-10">
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between gap-6">
        <a
          href="#home"
          className="font-doodle text-[2.15rem] leading-none tracking-tight text-foreground md:text-[2.35rem]"
          aria-label="Children art class home"
          onClick={(event) => handleAnchorClick(event, '#home')}
        >
          儿童画画班
        </a>

        <div className="hidden items-center gap-11 md:flex" aria-label="Primary navigation">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'border-b border-transparent pb-1 text-[13px] text-foreground/70 transition-colors duration-200 hover:text-foreground',
                index === 0 && 'border-foreground text-foreground',
              )}
              onClick={(event) => handleAnchorClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center gap-3 rounded-full bg-foreground px-7 py-3 text-[13px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 sm:inline-flex"
            onClick={(event) => handleAnchorClick(event, '#contact')}
          >
            预约体验课
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </a>
          <button
            type="button"
            className="inline-flex h-12 w-12 rotate-[-2deg] items-center justify-center rounded-[18px_14px_19px_13px] border-2 border-foreground/20 bg-[#fff6cf] text-foreground shadow-sm backdrop-blur transition-transform active:scale-95 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="doodle-paper mx-auto mt-4 max-w-[1320px] overflow-hidden rounded-[26px_18px_30px_20px] border-2 border-foreground/15 p-4 shadow-[0_18px_45px_rgba(45,35,20,0.12)] backdrop-blur md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-doodle text-2xl text-foreground">今天想看什么？</p>
            <span className="crayon-chip bg-[#ffd6cc] px-3 py-1 font-doodle text-sm text-foreground/75">
              小画室
            </span>
          </div>
          <div className="grid gap-3">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-[18px_14px_20px_13px] border border-foreground/10 px-4 py-3 font-doodle text-xl text-foreground shadow-sm transition-transform active:scale-[0.98]',
                  menuColors[index],
                  index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]',
                )}
                onClick={(event) => handleAnchorClick(event, item.href, () => setOpen(false))}
              >
                <span>{item.label}</span>
                <span className="text-sm text-foreground/45">0{index + 1}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex rotate-[-1deg] items-center justify-center gap-3 rounded-[999px_880px_920px_860px] bg-foreground px-5 py-4 text-sm font-bold text-white shadow-lg"
              onClick={(event) => handleAnchorClick(event, '#contact', () => setOpen(false))}
            >
              预约体验课
              <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </a>
          </div>
          <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
            <span className="crayon-chip bg-[#ffd6cc] px-3 py-1 font-doodle text-sm">开心</span>
            <span className="crayon-chip bg-[#cfefff] px-3 py-1 font-doodle text-sm">画画</span>
            <span className="crayon-chip bg-[#d9f4c7] px-3 py-1 font-doodle text-sm">试课</span>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SectionLabel({ value }: { value: string }) {
  return (
    <span className="crayon-chip inline-flex w-fit bg-[#fff1b8] px-3 py-1 font-doodle text-sm leading-none text-foreground/75">
      {value}
    </span>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group doodle-underline inline-flex items-center gap-7 text-[13px] font-semibold text-foreground transition-colors hover:text-muted"
      onClick={(event) => handleAnchorClick(event, href)}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
        size={22}
        strokeWidth={1.3}
      />
    </a>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden border-b border-foreground/10 bg-background">
      <VideoBackground />
      <div
        className="relative z-10 mx-auto flex min-h-screen max-w-[1320px] flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="animate-fade-rise max-w-6xl font-display text-5xl font-normal tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
          style={{ lineHeight: 0.95 }}
        >
          让孩子开心画画，
          <br className="hidden sm:block" /> 也敢说出{' '}
          <em className="font-normal italic text-muted">自己的想法。</em>
        </h1>
        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          适合 4-12 岁孩子的小班画画课。老师一步一步带，孩子在温暖的课堂里完成作品，也慢慢变得更有自信。
        </p>
        <a
          href="#contact"
          className="animate-fade-rise-delay-2 mt-12 inline-flex items-center gap-3 rounded-full bg-foreground px-14 py-5 text-base font-semibold text-white transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
          onClick={(event) => handleAnchorClick(event, '#contact')}
        >
          预约体验课
          <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
        </a>
      </div>
    </section>
  );
}

function FeaturedWorks() {
  const [active, setActive] = useState(0);

  const move = (direction: 1 | -1) => {
    setActive((value) => (value + direction + featuredWorks.length) % featuredWorks.length);
  };

  return (
    <section id="works" className="doodle-bg border-b border-foreground/10 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 md:grid-cols-[42px_1.1fr_1fr_1fr] md:items-start">
          <SectionLabel value="01" />
          <h2 className="max-w-[320px] font-doodle text-5xl font-normal leading-[1.02] tracking-[-0.02em] md:text-6xl">
            先找到适合孩子的课
          </h2>
          <p className="max-w-[250px] self-center text-sm leading-6 text-muted">
            不用一开始就画得很好。我们会按孩子年龄和性格，安排容易进入状态的课程。
          </p>
          <div className="self-center md:justify-self-end">
            <TextLink href="#contact">询问课程时间</TextLink>
          </div>
        </div>

        <div className="mt-11 grid gap-4 md:grid-cols-[0.86fr_1.34fr_1fr]">
          {featuredWorks.map((work, index) => (
            <article
              key={work.title}
              className={cn(
                'group cursor-pointer transition-opacity duration-300',
                active !== index && 'md:opacity-90 md:hover:opacity-100',
              )}
              onClick={() => setActive(index)}
            >
              <div className="overflow-hidden rounded-[18px] bg-foreground/[0.04]">
                <img
                  src={work.image}
                  alt={work.alt}
                  className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] md:h-[440px]"
                />
              </div>
              <div className="mt-5 text-[13px] leading-5">
                <h3 className="font-doodle text-lg text-foreground">{work.title}</h3>
                <p className="mt-2 text-muted">{work.meta}</p>
                <p className="text-muted">{work.year}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 md:mt-10">
          <div className="mr-auto hidden h-px max-w-[840px] flex-1 bg-foreground/15 md:block">
            <div
              className="h-px bg-foreground transition-all duration-300"
              style={{ width: `${((active + 1) / featuredWorks.length) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => move(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground hover:text-white"
            aria-label="Previous featured work"
          >
            <ArrowRight className="rotate-180" size={18} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground hover:text-white"
            aria-label="Next featured work"
          >
            <ArrowRight size={18} strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </section>
  );
}

function InnerWorld() {
  return (
    <section id="studio" className="doodle-bg border-b border-foreground/10">
      <div className="grid md:grid-cols-[1.04fr_1.1fr]">
        <div className="min-h-[520px] overflow-hidden border-y border-foreground/10 md:border-y-0 md:border-r">
          <img
            src="/assets/teacher-guidance.png"
            alt="Art teacher gently helping a child paint at an easel."
            className="h-full min-h-[520px] w-full object-cover"
          />
        </div>
        <div className="relative flex min-h-[520px] items-center px-6 py-16 md:px-20">
        <div className="relative z-10 max-w-[470px]">
            <SectionLabel value="02" />
            <h2 className="mt-10 font-doodle text-5xl font-normal leading-[1.02] tracking-[-0.02em] md:text-6xl">
              孩子上课时，会发生什么？
            </h2>
            <p className="mt-8 text-sm leading-7 text-muted md:text-base">
              有些孩子一开始会说“我不会画”。老师会先让孩子放松下来，
              再用简单的示范和鼓励，带他们一步一步完成作品。
              我们更重视孩子愿意尝试、愿意表达，而不是每一笔都画得一样。
            </p>
            <p className="mt-8 font-doodle text-4xl text-foreground/75">温柔引导，小班陪伴</p>
            <div className="mt-10">
              <TextLink href="#journal">看看家长常问的问题</TextLink>
            </div>
          </div>
          <div className="pointer-events-none absolute right-0 top-20 z-0 hidden h-[360px] w-[210px] bg-[url('/assets/kids-watercolor.png')] bg-cover bg-center opacity-10 md:block" />
        </div>
      </div>
    </section>
  );
}

function StudioNotes() {
  return (
    <section className="doodle-bg border-b border-foreground/10 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 md:grid-cols-[42px_1.1fr_1fr_1fr] md:items-end">
          <SectionLabel value="03" />
          <h2 className="font-doodle text-5xl font-normal leading-[1.02] tracking-[-0.02em] md:text-6xl">
            一堂课怎么进行？
          </h2>
          <p className="max-w-[280px] text-sm leading-6 text-muted">
            课堂流程简单、稳定，孩子知道下一步做什么，家长也容易了解孩子学到了什么。
          </p>
          <div className="md:justify-self-end">
            <TextLink href="#contact">预约体验课</TextLink>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {studioNotes.map((note) => (
            <article
              key={note.title}
              className="group overflow-hidden rounded-[18px] bg-white transition-transform hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={note.image}
                  alt={note.alt}
                  className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="font-doodle text-lg text-foreground">{note.title}</h3>
                <p className="mt-3 text-[13px] leading-5 text-muted">{note.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section id="journal" className="doodle-bg border-b border-foreground/10 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[42px_0.85fr_2fr_64px]">
        <SectionLabel value="04" />
        <div>
          <h2 className="font-doodle text-5xl font-normal leading-[1.02] tracking-[-0.02em] md:text-6xl">
            家长最关心的事
          </h2>
          <p className="mt-8 max-w-[260px] text-sm leading-6 text-muted">
            报名前不用想太复杂。先了解年龄、班级人数和体验课，就可以决定下一步。
          </p>
          <div className="mt-10">
            <TextLink href="#contact">直接问老师</TextLink>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {journalItems.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                'scribble-note group relative min-h-[300px] overflow-hidden p-6 transition-transform hover:-translate-y-1',
                index === 0 && 'rotate-[-1.2deg] bg-[#fff2ba]',
                index === 1 && 'rotate-[1deg] bg-[#d9f4c7]',
                index === 2 && 'rotate-[-0.4deg] bg-[#d7efff]',
              )}
            >
              <div className="absolute right-5 top-5 h-8 w-12 rotate-3 rounded-[50%] bg-white/50" />
              <span className="crayon-chip inline-flex bg-white/65 px-3 py-1 font-doodle text-sm text-foreground/70">
                {item.label}
              </span>
              <div className="mt-9">
                <p className="font-doodle text-lg text-foreground/55">家长问：</p>
                <h3 className="mt-2 font-doodle text-3xl leading-[1.04] tracking-[-0.01em] text-foreground">
                  {item.title}
                </h3>
                <div className="my-6 h-[3px] w-20 rounded-full bg-foreground/15" />
                <p className="font-doodle text-lg text-foreground/55">老师答：</p>
                <p className="mt-2 text-[15px] leading-7 text-foreground/72">{item.body}</p>
              </div>
              <div className="absolute bottom-5 right-5 flex gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-[#ff9f8f]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd76a]" />
                <span className="h-3 w-3 rounded-full bg-[#73bdf4]" />
              </div>
            </article>
          ))}
        </div>

        <div className="hidden items-center justify-center md:flex">
          <a
            href="#contact"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground hover:text-white"
            aria-label="Go to contact"
            onClick={(event) => handleAnchorClick(event, '#contact')}
          >
            <ArrowRight size={20} strokeWidth={1.4} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="doodle-bg relative overflow-hidden px-6 py-16 md:px-10 md:py-20">
      <img
        src="/assets/trial-class-table.png"
        alt="Welcoming art studio table with children artwork and painting supplies."
        className="absolute inset-y-0 right-0 hidden h-full w-[42%] object-cover opacity-80 md:block"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,#fff_52%,rgba(255,255,255,0.74)_75%,rgba(255,255,255,0.18)_100%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[42px_1.2fr_1fr] md:items-end">
        <SectionLabel value="05" />
        <div>
          <h2 className="max-w-[560px] font-doodle text-5xl font-normal leading-[1.02] tracking-[-0.02em] md:text-6xl">
            想让孩子先来试一堂？
          </h2>
          <p className="mt-7 max-w-[430px] text-sm leading-6 text-muted">
            留下孩子年龄和想上的时间，我们会帮你安排适合的体验课。
            不需要准备画具，孩子带着轻松的心情来就可以。
          </p>
        </div>
        <div className="flex flex-col gap-10 md:items-end">
          <a
            href="https://wa.me/60123456789"
            className="inline-flex w-fit items-center gap-4 rounded-full bg-foreground px-8 py-4 text-[13px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
          >
            WhatsApp 预约
            <ArrowRight aria-hidden="true" size={17} strokeWidth={1.8} />
          </a>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[12px] text-muted">
            <span>© 2026 儿童画画班</span>
            <a href="#journal" className="hover:text-foreground" onClick={(event) => handleAnchorClick(event, '#journal')}>
              家长须知
            </a>
            <a href="https://wa.me/60123456789" className="hover:text-foreground">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <a
        href="#home"
        className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-white/80 text-foreground backdrop-blur transition-colors hover:bg-foreground hover:text-white"
        aria-label="Back to top"
        onClick={(event) => handleAnchorClick(event, '#home')}
      >
        <ArrowUp size={16} strokeWidth={1.5} />
      </a>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Navigation />
      <Hero />
      <FeaturedWorks />
      <InnerWorld />
      <StudioNotes />
      <Journal />
      <Contact />
    </div>
  );
}
