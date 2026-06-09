<div id="top-table-container" style="max-width:900px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table style="width:100%;border-collapse:collapse;font-size:15px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.06);">
    <thead>
      <tr style="background:#f8f9fa;border-bottom:2px solid #e9ecef;">
        <th style="padding:14px 16px;text-align:center;width:60px;color:#868e96;font-weight:500;">#</th>
        <th style="padding:14px 16px;text-align:left;color:#868e96;font-weight:500;">文章标题</th>
        <th style="padding:14px 16px;text-align:right;width:100px;color:#868e96;font-weight:500;">阅读量</th>
      </tr>
    </thead>
    <tbody id="top-table-body">
      <tr><td colspan="3" style="padding:40px;text-align:center;color:#adb5bd;">加载中...</td></tr>
    </tbody>
  </table>
</div>

<script>
(function() {
  var limit = 50;
  try {
    var xhr = new XMLHttpRequest();
    var apiBase = window.location.origin;
    xhr.open('GET', apiBase + '/api/top?limit=' + limit, true);
    xhr.timeout = 5000;
    xhr.onload = function() {
      if (xhr.status !== 200) return;
      var pages = JSON.parse(xhr.responseText);
      var body = document.getElementById('top-table-body');
      if (!pages.length) {
        body.innerHTML = '<tr><td colspan="3" style="padding:40px;text-align:center;color:#adb5bd;">暂无数据</td></tr>';
        return;
      }
      var html = '';
      var medals = ['🥇', '🥈', '🥉'];
      pages.forEach(function(p, i) {
        var rank = i + 1;
        var rankHtml = i < 3 ? '<span style="font-size:20px">' + medals[i] + '</span>' : '<span style="color:#adb5bd">' + rank + '</span>';
        var barPct = Math.min(100, Math.round(p.count / pages[0].count * 100));
        var title = (p.title || p.path).replace(/\s*-\s*mikigo\.site$/i, '');
        var path = p.path;
        html += '<tr style="border-bottom:1px solid #f1f3f5;">' +
          '<td style="padding:12px 16px;text-align:center;">' + rankHtml + '</td>' +
          '<td style="padding:12px 16px;">' +
            '<a href="' + path + '" style="color:#212529;text-decoration:none;">' + title + '</a>' +
            '<div style="margin-top:4px;height:3px;background:#f1f3f5;border-radius:2px;overflow:hidden;">' +
              '<div style="height:100%;width:' + barPct + '%;background:linear-gradient(90deg,#4a90d9,#67b8e3);border-radius:2px;"></div>' +
            '</div>' +
          '</td>' +
          '<td style="padding:12px 16px;text-align:right;font-weight:600;color:#495057;">' + p.count.toLocaleString() + '</td>' +
        '</tr>';
      });
      body.innerHTML = html;
    };
    xhr.send();
  } catch(e) { /* silent */ }
})();
</script>
