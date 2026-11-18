(function () {
  var ITEMS = [
    { t: '首页', d: 'Los Santos Police Department 官方网站', u: '/', k: '首页 home 官网 主页 lspd 警察局' },
    { t: '新闻公告', d: '部门最新动态与通知公告', u: '/news/', k: '新闻 公告 通知 动态 news 消息 最新' },
    { t: '加入 LSPD', d: '招募条件、流程与在线报名', u: '/joinlspd/', k: '加入 招募 警校 报名 报考 学员 join 招警 应聘 当警察' },
    { t: '报名问卷', d: '加入 LSPD 在线申请问卷', u: '/joinlspd/questionnaire/', k: '报名 问卷 申请 表单 questionnaire 应聘' },
    { t: '武器执照', d: '武器执照申请条件与办理流程', u: '/weaponlicense/', k: '执照 武器 枪 许可 证照 持枪 枪证 weapon license' },
    { t: '纪律投诉', d: '警员违纪投诉与内部事务申诉', u: '/internalaffairscomplaint/', k: '投诉 举报 线索 申诉 纪律 内务 督察 complaint' },
    { t: '了解 LSPD', d: '部门介绍、分局与组织架构', u: '/understandinglspd/', k: '了解 关于 分局 部门 警局 架构 介绍 about' },
    { t: '实用贴士', d: '市民安全提示与常见问题', u: '/tips/', k: '贴士 提示 安全 常见问题 帮助 tips faq 指南' },
    { t: '警员内网', d: 'LSPD MDT 内部系统（警员登录）', u: '/portal/', k: '内网 portal mdt 警员 系统 登录 办公' },
    { t: '账号登录', d: '登录 LSPD 账号', u: '/login/', k: '登录 登陆 login 账号 密码 进入' },
    { t: '个人中心', d: '我的账号信息与管理', u: '/my/', k: '个人 中心 我的 账号 my account 资料' },
    { t: '修改密码', d: '修改账号登录密码', u: '/my/password/', k: '修改密码 改密码 password 密码 重置' },
    { t: '找回密码', d: '忘记密码时通过邮箱找回', u: '/account/forgotpassword/', k: '忘记密码 找回 密码 重置 forgot reset' },
    { t: '账号中心', d: '账号设置与安全', u: '/account/', k: '账号 中心 设置 安全 account' },
    { t: '问题反馈', d: '提交网站或系统问题反馈', u: '/bug/', k: '反馈 问题 bug 报错 建议 意见 故障' },
    { t: '紧急求助', d: '紧急情况请拨打 911', u: '#', k: '紧急 求助 911 报警 报案 emergency' }
  ];
  function norm(s) { return (s || '').toLowerCase(); }
  function init(form) {
    var input = form.querySelector('input');
    if (!input || input._ssDone) return;
    input._ssDone = 1;
    form.style.position = 'relative';
    var box = document.createElement('div');
    box.style.cssText = 'position:absolute;top:calc(100% + 6px);left:0;min-width:300px;width:max-content;max-width:360px;background:#fff;border:1px solid #e2e6ea;border-radius:10px;box-shadow:0 12px 32px rgba(16,19,24,.14);z-index:99990;max-height:340px;overflow:auto;display:none;';
    form.appendChild(box);
    var cur = [];
    function render(list, q) {
      cur = list;
      if (!q) { box.style.display = 'none'; return; }
      var h = '';
      if (list.length) {
        h = list.map(function (it) {
          return '<a href="' + it.u + '" style="display:block;padding:10px 16px;text-decoration:none">'
            + '<div style="font-size:14px;font-weight:600;color:#101318">' + it.t + '</div>'
            + '<div style="font-size:12px;color:#8a94a0;margin-top:2px">' + it.d + '</div></a>';
        }).join('');
      } else {
        h = '<div style="padding:14px 16px;font-size:13px;color:#8a94a0">未找到「' + q.replace(/</g, '&lt;') + '」相关功能，可去 <a href="/news/" style="color:#1a5fb4">新闻公告</a> 看看</div>';
      }
      box.innerHTML = h;
      box.style.display = 'block';
    }
    function search(q) {
      q = (q || '').trim();
      if (!q) { render([], ''); return; }
      var nq = norm(q), scored = [];
      for (var i = 0; i < ITEMS.length; i++) {
        var it = ITEMS[i], s = 0;
        if (norm(it.t).indexOf(nq) >= 0) s += 100;
        if (norm(it.k).indexOf(nq) >= 0) s += 60;
        if (norm(it.d).indexOf(nq) >= 0) s += 30;
        if (!s) {
          var hay = norm(it.k + ' ' + it.t + ' ' + it.d), hit = 0, chars = nq.split('');
          for (var c = 0; c < chars.length; c++) { if (hay.indexOf(chars[c]) >= 0) hit++; }
          if (hit >= Math.max(1, Math.ceil(chars.length * 0.6))) s += 20;
        }
        if (s) scored.push([s, i]);
      }
      scored.sort(function (a, b) { return b[0] - a[0]; });
      render(scored.slice(0, 8).map(function (x) { return ITEMS[x[1]]; }), q);
    }
    input.addEventListener('input', function () { search(input.value); });
    input.addEventListener('focus', function () { if (input.value.trim()) search(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (cur && cur.length) { location.href = cur[0].u; }
        else { location.href = '/news/'; }
        e.preventDefault();
      } else if (e.key === 'Escape') { box.style.display = 'none'; }
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) box.style.display = 'none'; });
    box.addEventListener('click', function () { box.style.display = 'none'; });
  }
  function boot() {
    var forms = document.querySelectorAll('form.search-input');
    for (var i = 0; i < forms.length; i++) init(forms[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
