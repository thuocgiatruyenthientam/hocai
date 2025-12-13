from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Dict, List

from flask import Flask, abort, flash, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy

BASE_DIR = Path(__file__).parent
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "thi-en-tam-secret-key")
app.config["ADMIN_USERNAME"] = os.getenv("ADMIN_USERNAME", "admin")
app.config["ADMIN_PASSWORD"] = os.getenv("ADMIN_PASSWORD", "phat2009")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://h51ecb951c_hocai:phat2009@localhost/h51ecb951c_hocai?charset=utf8mb4",
)
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_size": 5,
    "max_overflow": 2,
    "pool_recycle": 280,
    "pool_timeout": 30,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
server_name = os.getenv("SERVER_NAME")
if server_name:
    app.config["SERVER_NAME"] = server_name
app.config["PREFERRED_URL_SCHEME"] = os.getenv("PREFERRED_URL_SCHEME", "https")
db = SQLAlchemy(app)


def _json_to_list(value: str | None) -> List[str]:
    try:
        return json.loads(value or "[]")
    except json.JSONDecodeError:
        return []


class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, default="")
    remedies_json = db.Column(db.Text, default="[]")

    @property
    def remedies_list(self) -> List[str]:
        return _json_to_list(self.remedies_json)

    def set_remedies(self, remedies: List[str]) -> None:
        self.remedies_json = json.dumps(remedies, ensure_ascii=False)


class NewsItem(db.Model):
    __tablename__ = "news_items"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    source = db.Column(db.String(255), default="")
    url = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text, default="")


def seed_topics() -> List[Dict]:
    default_topics: List[Dict] = [
        {
            "slug": "soi-than",
            "title": "Sỏi thận",
            "summary": "Giải pháp thảo dược giúp giảm đau, bào mòn sỏi và hỗ trợ tiết niệu khỏe mạnh.",
            "remedies": [
                "Nước râu ngô, kim tiền thảo đun uống hằng ngày",
                "Uống đủ nước kết hợp trà rễ cỏ tranh, xa tiền tử",
                "Xoa bóp vùng hông bằng dầu thảo mộc, giữ ấm cơ thể",
            ],
        },
        {
            "slug": "viem-cau-than",
            "title": "Viêm cầu thận",
            "summary": "Công thức thảo dược gia truyền giảm viêm, lợi tiểu và bảo vệ chức năng lọc của thận.",
            "remedies": [
                "Sắc rễ cây muồng trâu, rau má, mã đề uống 2 lần/ngày",
                "Ăn nhạt, ngủ đủ giấc, tránh rượu bia và giữ ấm thắt lưng",
                "Xoa bóp day ấn huyệt thận du giúp lưu thông khí huyết",
            ],
        },
        {
            "slug": "suy-than",
            "title": "Suy thận",
            "summary": "Bồi bổ thận khí, hỗ trợ phục hồi sinh lực với thảo dược sạch từ đồng bằng và cao nguyên.",
            "remedies": [
                "Chè dây, hoàng kỳ, đương quy sắc uống thay nước",
                "Chế độ ăn nhiều rau xanh, hạn chế đạm đỏ và thực phẩm chế biến",
                "Tập thở bụng, thiền nhẹ 15 phút mỗi ngày",
            ],
        },
        {
            "slug": "viem-tiet-nieu",
            "title": "Viêm tiết niệu",
            "summary": "Kháng khuẩn tự nhiên, lợi tiểu và làm mát giúp tiểu tiện dễ chịu, giảm tái phát.",
            "remedies": [
                "Rau diếp cá, râu ngô, kim ngân hoa sắc uống",
                "Uống đủ 2 lít nước/ngày và vệ sinh cá nhân đúng cách",
                "Tắm lá trầu không, lá tràm dịu nhẹ để giảm ngứa rát",
            ],
        },
        {
            "slug": "lam-dep-da",
            "title": "Làm đẹp da",
            "summary": "Thanh lọc cơ thể, dưỡng huyết và phục hồi làn da sáng khỏe từ thảo dược Chăm.",
            "remedies": [
                "Uống trà atiso, trà xanh, cam thảo mỗi sáng",
                "Đắp mặt nạ nghệ, mật ong và sữa chua 2 lần/tuần",
                "Ngủ trước 23h, tập yoga nhẹ để giảm stress",
            ],
        },
        {
            "slug": "viem-khop",
            "title": "Viêm khớp",
            "summary": "Giảm đau, kháng viêm, phục hồi vận động với bài thuốc gia truyền của người Chăm.",
            "remedies": [
                "Ngâm chân gừng muối ấm, xoa bóp bằng dầu gió thảo mộc",
                "Uống sắc rễ nhàu, dây đau xương, thiên niên kiện",
                "Tập kéo giãn khớp, đi bộ nhẹ 20 phút/ngày",
            ],
        },
        {
            "slug": "thoai-hoa-khop",
            "title": "Thoái hóa khớp",
            "summary": "Tăng cường sụn khớp, gim khô cứng với thảo dược ấm và bổ.",
            "remedies": [
                "Sắc ngải cứu, lá lốt, thiên niên kiện uống buổi tối",
                "Chườm thảo dược rang muối nóng vào vùng khớp",
                "Bổ sung collagen, tập bơi hoặc đạp xe nhẹ",
            ],
        },
        {
            "slug": "gout",
            "title": "Gout",
            "summary": "Kiểm soát acid uric, giảm sưng đau khớp với thảo dược mát và lợi tiểu.",
            "remedies": [
                "Trà lá tía tô, râu ngô, ké đầu ngựa uống ấm",
                "Ăn nhiều rau xanh, giảm thịt đỏ, nội tạng và bia rượu",
                "Chườm lạnh khớp sưng, nghỉ ngơi khi đau cấp",
            ],
        },
    ]

    for topic in default_topics:
        model = Topic(slug=topic["slug"], title=topic["title"], summary=topic["summary"])
        model.set_remedies(topic["remedies"])
        db.session.add(model)
    db.session.commit()
    return default_topics


def seed_news() -> List[Dict]:
    default_news: List[Dict] = [
        {
            "title": "5 thảo dược giúp thanh lọc thận an toàn",
            "source": "Tạp chí Đông y",
            "url": "https://example.com/thao-duoc-thanh-loc-than",
            "summary": "Giới thiệu các vị thuốc mát, lợi tiểu và cách sử dụng đúng để bảo vệ thận.",
        },
        {
            "title": "Dân gian chữa sỏi thận bằng kim tiền thảo",
            "source": "Sức khỏe & Đời sống",
            "url": "https://example.com/kim-tien-thao-soi-than",
            "summary": "Cơ chế bào mòn sỏi và cách sắc uống kim tiền thảo chuẩn vị nam dược.",
        },
        {
            "title": "Đông y hỗ trợ viêm cầu thận mạn tính",
            "source": "Y học cổ truyền",
            "url": "https://example.com/dong-y-viem-cau-than",
            "summary": "Phác đồ kết hợp thảo dược lợi tiểu, kháng viêm với chế độ ăn nhạt.",
        },
        {
            "title": "Chăm sóc da tự nhiên với thảo mộc bản địa",
            "source": "Cộng đồng chăm sóc da",
            "url": "https://example.com/lam-dep-da-thao-moc",
            "summary": "Hướng dẫn dùng nghệ, trà xanh và mật ong để dưỡng sáng da an toàn.",
        },
        {
            "title": "Cách ngăn tái phát viêm tiết niệu từ chế độ sinh hoạt",
            "source": "Sống khỏe",
            "url": "https://example.com/viem-tiet-nieu-sinh-hoat",
            "summary": "Các mẹo uống nước, vệ sinh và bài thuốc dân gian giúp giảm nguy cơ tái phát.",
        },
        {
            "title": "Bí quyết người Chăm chăm sóc khớp",
            "source": "Báo Sức khỏe",
            "url": "https://example.com/bi-quyet-cham-soc-khop",
            "summary": "Thực hành xoa bóp, ngâm thảo dược và ẩm thực ấm áp bảo vệ xương khớp.",
        },
        {
            "title": "Điều chỉnh lối sống để kiểm soát gout",
            "source": "Tư vấn dinh dưỡng",
            "url": "https://example.com/kiem-soat-gout",
            "summary": "Giảm đạm động vật, tăng thực vật và kết hợp thảo dược mát để hạ acid uric.",
        },
        {
            "title": "Những dấu hiệu cảnh báo suy thận sớm",
            "source": "Sức khỏe thận",
            "url": "https://example.com/dau-hieu-suy-than",
            "summary": "Phát hiện sớm phù, mệt mỏi và cách hỗ trợ với bài thuốc bổ thận khí.",
        },
        {
            "title": "Thải độc an toàn cho người viêm khớp",
            "source": "Tạp chí Dinh dưỡng",
            "url": "https://example.com/thai-doc-viem-khop",
            "summary": "Công thức nước uống thảo mộc giúp giảm viêm, hỗ trợ chuyển hóa.",
        },
        {
            "title": "3 bước chăm sóc tiết niệu khỏe mạnh hằng ngày",
            "source": "Mẹo sống khỏe",
            "url": "https://example.com/cham-soc-tiet-nieu",
            "summary": "Uống nước đủ, vệ sinh khoa học và thảo dược phòng ngừa viêm nhiễm.",
        },
    ]

    for item in default_news:
        db.session.add(
            NewsItem(
                title=item["title"],
                source=item.get("source", ""),
                url=item["url"],
                summary=item.get("summary", ""),
            )
        )
    db.session.commit()
    return default_news


def topic_to_dict(topic: Topic) -> Dict:
    return {
        "slug": topic.slug,
        "title": topic.title,
        "summary": topic.summary,
        "remedies": topic.remedies_list,
    }


def news_to_dict(item: NewsItem) -> Dict:
    return {
        "id": item.id,
        "title": item.title,
        "source": item.source,
        "url": item.url,
        "summary": item.summary,
    }


@lru_cache(maxsize=1)
def _cached_topics() -> List[Dict]:
    topics = Topic.query.order_by(Topic.title.asc()).all()
    if not topics:
        seed_topics()
        topics = Topic.query.order_by(Topic.title.asc()).all()
    return [topic_to_dict(topic) for topic in topics]


@lru_cache(maxsize=1)
def _cached_news() -> List[Dict]:
    news_items = NewsItem.query.order_by(NewsItem.id.desc()).all()
    if not news_items:
        seed_news()
        news_items = NewsItem.query.order_by(NewsItem.id.desc()).all()
    return [news_to_dict(item) for item in news_items]


def refresh_topic_cache() -> List[Dict]:
    _cached_topics.cache_clear()
    return _cached_topics()


def refresh_news_cache() -> List[Dict]:
    _cached_news.cache_clear()
    return _cached_news()


def get_topics() -> List[Dict]:
    return _cached_topics()


def get_news(limit: int | None = None) -> List[Dict]:
    mapped = _cached_news()
    return mapped[:limit] if limit else mapped


def find_topic(slug: str) -> Dict:
    topic = Topic.query.filter_by(slug=slug).first()
    if topic:
        return topic_to_dict(topic)
    abort(404)


def is_admin() -> bool:
    return session.get("admin", False)


def require_admin() -> None:
    if not is_admin():
        abort(403)


@app.context_processor
def inject_globals():
    return {
        "site_name": "Nhà thuốc Nam Thiên Tâm",
        "nav_topics": get_topics(),
    }


@app.route("/")
def home():
    topics = get_topics()
    latest_news = get_news(limit=4)
    return render_template(
        "home.html",
        topics=topics,
        latest_news=latest_news,
        meta={
            "title": "Nhà thuốc Nam Thiên Tâm | Bài thuốc Chăm gia truyền",
            "description": "Bài thuốc nam hỗ trợ sỏi thận, viêm cầu thận, gout, viêm khớp, làm đẹp da và chăm sóc tiết niệu từ dân tộc Chăm.",
            "canonical": url_for("home", _external=True),
        },
    )


@app.route("/chu-de/<slug>")
def topic_detail(slug: str):
    topic = find_topic(slug)
    return render_template(
        "topic.html",
        topic=topic,
        meta={
            "title": f"{topic['title']} | Bài thuốc Nam Thiên Tâm",
            "description": topic["summary"],
            "canonical": url_for("topic_detail", slug=slug, _external=True),
            "breadcrumbs": [
                {"name": "Trang chủ", "url": url_for("home", _external=True)},
                {"name": "Chủ đề", "url": url_for("home", _external=True) + "#topics"},
                {"name": topic["title"], "url": url_for("topic_detail", slug=slug, _external=True)},
            ],
        },
    )


@app.route("/tin-tuc")
def news_list():
    return render_template(
        "news.html",
        news_items=get_news(),
        meta={
            "title": "Tin tức Đông y & bài thuốc nam hữu ích",
            "description": "Tổng hợp tin tức chất lượng về thảo dược, sức khỏe thận, xương khớp và làm đẹp da.",
            "canonical": url_for("news_list", _external=True),
        },
    )


@app.route("/admin", methods=["GET", "POST"])
def admin_dashboard():
    require_admin()
    topics = get_topics()
    news_items = get_news()
    return render_template("admin/dashboard.html", topics=topics, news_items=news_items)


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if (
            username == app.config["ADMIN_USERNAME"]
            and password == app.config["ADMIN_PASSWORD"]
        ):
            session["admin"] = True
            flash("Đăng nhập thành công", "success")
            return redirect(url_for("admin_dashboard"))
        flash("Sai tài khoản hoặc mật khẩu", "danger")
    return render_template("admin/login.html")


@app.route("/admin/logout")
def admin_logout():
    session.pop("admin", None)
    flash("Đã đăng xuất", "info")
    return redirect(url_for("home"))


@app.route("/admin/topics", methods=["POST"])
def admin_add_topic():
    require_admin()
    title = request.form.get("title", "").strip()
    slug = request.form.get("slug", "").strip()
    summary = request.form.get("summary", "").strip()
    remedies_text = request.form.get("remedies", "")
    remedies = [item.strip() for item in remedies_text.split("\n") if item.strip()]

    if not title or not slug:
        flash("Vui lòng nhập đầy đủ tiêu đề và đường dẫn", "warning")
        return redirect(url_for("admin_dashboard"))

    if Topic.query.filter_by(slug=slug).first():
        flash("Đường dẫn đã tồn tại", "danger")
        return redirect(url_for("admin_dashboard"))

    topic = Topic(title=title, slug=slug, summary=summary)
    topic.set_remedies(remedies)
    db.session.add(topic)
    db.session.commit()
    refresh_topic_cache()

    flash("Đã thêm chủ đề", "success")
    return redirect(url_for("admin_dashboard"))


@app.route("/admin/topics/<slug>", methods=["POST"])
def admin_update_topic(slug: str):
    require_admin()
    topic = Topic.query.filter_by(slug=slug).first()
    if not topic:
        abort(404)

    topic.title = request.form.get("title", topic.title).strip()
    topic.summary = request.form.get("summary", topic.summary).strip()
    remedies_text = request.form.get("remedies", "")
    remedies = [item.strip() for item in remedies_text.split("\n") if item.strip()]
    if remedies:
        topic.set_remedies(remedies)

    db.session.commit()
    refresh_topic_cache()
    flash("Đã cập nhật chủ đề", "success")
    return redirect(url_for("admin_dashboard"))


@app.route("/admin/topics/<slug>/delete", methods=["POST"])
def admin_delete_topic(slug: str):
    require_admin()
    topic = Topic.query.filter_by(slug=slug).first()
    if topic:
        db.session.delete(topic)
        db.session.commit()
        refresh_topic_cache()
        flash("Đã xóa chủ đề", "info")
    return redirect(url_for("admin_dashboard"))


@app.route("/admin/news", methods=["POST"])
def admin_add_news():
    require_admin()
    title = request.form.get("title", "").strip()
    url_value = request.form.get("url", "").strip()
    source = request.form.get("source", "").strip()
    summary = request.form.get("summary", "").strip()

    if not title or not url_value:
        flash("Tiêu đề và liên kết là bắt buộc", "warning")
        return redirect(url_for("admin_dashboard"))

    news_item = NewsItem(title=title, url=url_value, source=source, summary=summary)
    db.session.add(news_item)
    db.session.commit()
    refresh_news_cache()

    flash("Đã thêm tin mới", "success")
    return redirect(url_for("admin_dashboard"))


@app.route("/admin/news/<int:item_id>/delete", methods=["POST"])
def admin_delete_news(item_id: int):
    require_admin()
    news_item = NewsItem.query.get(item_id)
    if news_item:
        db.session.delete(news_item)
        db.session.commit()
        refresh_news_cache()
        flash("Đã xóa tin", "info")
    return redirect(url_for("admin_dashboard"))


@app.errorhandler(403)
def forbidden(_):
    return render_template("errors/403.html"), 403


@app.errorhandler(404)
def not_found(_):
    return render_template("errors/404.html"), 404


def setup_database() -> None:
    db.create_all()
    if not Topic.query.first():
        seed_topics()
    refresh_topic_cache()
    if not NewsItem.query.first():
        seed_news()
    refresh_news_cache()


if __name__ == "__main__":
    with app.app_context():
        setup_database()
    app.run(debug=True, host="0.0.0.0", port=5000)
