/**
 * みらい税理士法人 - メインJavaScript
 * 各ページの動的機能（ハンバーガーメニュー、スクロールフェードイン、数値カウントアップ、フォーム処理）を管理します。
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. スクロール時のヘッダー表示切替
  // ------------------------------------------------------------------------
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ------------------------------------------------------------------------
  // 2. モバイル用ハンバーガーメニューの開閉
  // ------------------------------------------------------------------------
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav?.classList.toggle('active');
  });

  // メニュー内のリンクをクリックした際に自動で閉じる処理
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      nav?.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // 3. スクロール監視による要素のフェードインアニメーション (Intersection Observer)
  // ------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // 一度アニメーションしたら監視解除
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // ------------------------------------------------------------------------
  // 4. 実績数値のカウントアップアニメーション
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      let count = 0;
      const speed = Math.max(20, Math.floor(2000 / target)); // 全体を約2秒でアニメーション

      const updateCount = () => {
        count += Math.ceil(target / 50);
        if (count >= target) {
          stat.childNodes[0].textContent = target.toLocaleString();
        } else {
          stat.childNodes[0].textContent = count.toLocaleString();
          setTimeout(updateCount, speed);
        }
      };

      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          animateStats();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ------------------------------------------------------------------------
  // 5. お問い合わせフォーム送信ハンドラー & モーダル表示
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // 実際のサーバー送信を制御
      
      // 送信中演出（ボタンの活性状態制御）
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '送信中...';
      }

      // 送信成功の模擬非同期処理
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        contactForm.reset(); // フォームのリセット

        // 完了モーダルの表示
        if (modal) {
          modal.classList.add('open');
        }
      }, 1000);
    });
  }

  // モーダル閉じるボタン
  closeModalBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  // モーダル外側クリックで閉じる
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal?.classList.remove('open');
    }
  });
});
