@AGENTS.md

# Permissions

All tool calls are allowed without confirmation. This includes:
- Reading, writing, editing any files
- Running any shell commands (npm, git, etc.)
- Installing/removing packages
- Creating/deleting files and directories
- Running dev servers, builds, tests
- Any git operations

Do not ask for permission for the above. Just do it.

# Git & 배포 (중요)

**커밋(`git commit`)과 푸시/배포(`git push`)는 사용자가 명시적으로 요청할 때만** 수행한다.

- 파일 생성·수정·삭제, 로컬 dev 서버 실행, 빌드/테스트는 자유롭게 진행해도 된다.
- 그러나 `git commit` / `git push` 는 사용자가 "커밋해", "푸시해", "배포해" 등으로 **분명히 지시했을 때만** 실행한다.
- 한 번 푸시 지시를 받았다고 해서 이후 작업까지 자동으로 커밋·푸시하지 말 것. 매번 새로 지시받아야 한다.
- main 브랜치 푸시는 Vercel 자동 배포를 유발하므로 특히 주의한다.
