build-netlify:
	chmod +x install-protoc.sh
	./install-protoc.sh
	$(MAKE) gen-proto-netlify
	npm run build

start:
	npm run dev

gen-proto:
	npm run proto:clear
	npm run proto:generate

gen-proto-netlify:
	npm run proto:clear
	npm run proto:generate-netlify
