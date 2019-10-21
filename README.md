Daily Frame
=======

당신의 일상을 공유하세요! - 사진을 올리고, 좋아요를 누르고, 팔로우를 하고, 댓글로 이야기하는 SNS 웹 애플리케이션

https://dailyframe.herokuapp.com

![image](https://user-images.githubusercontent.com/43179397/67194587-5bf78100-f432-11e9-8dac-3bb828eb78a1.png)



## 요약

- OAuth 2.0 인증으로 구글 인증
- JWT 토큰 발급 방식으로 로그인
- 게시물, 댓글 CRUD
- 게시물 좋아요, 팔로우 신청
- 좋아요 누른 게시물이나 자신이 팔로우한 게시물만 모아서 볼 수 있음



## 특이사항

- MongoDB에서 MySQL로 마이그레이션
- 이미지 storage는 AWS S3 Storage 선정
- 비밀번호를 잃어버렸을 경우, 비밀번호를 재설정 할 수 있도록 이메일 발송



## DB 스키마

![dbmodel](https://user-images.githubusercontent.com/43179397/63771882-f778e380-c912-11e9-9c82-933218a2bee1.png)