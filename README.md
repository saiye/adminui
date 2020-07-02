# about
```
Focus on background templates

adminui base on  vue+element-ui develop

```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

```text
build file set
server
{
	listen  443;
	server_name  www.admin.com;

	ssl on;
	ssl_certificate /mnt/web/cert/test/server.crt;
	ssl_certificate_key /mnt/web/cert/test/server.key;
	#ssl_client_certificate ca.crt;#双向认证
	#ssl_verify_client on; #双向认证
	ssl_session_timeout 5m;
	ssl_protocols SSLv2 SSLv3 TLSv1;
	ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
	ssl_prefer_server_ciphers on;
	index index.html index.htm;

	root  /mnt/web/adminui/dist;
	    client_max_body_size 20m; 
	    client_body_buffer_size 128k;
	    location / {
	      try_files $uri $uri/ /index.html last;
	      index index.html;
	    }
	    location /admin {
		  # 后端的真实接口
		proxy_http_version 1.1;
		proxy_set_header Connection "keep-alive";
		#proxy_set_header Host $http_host;
		proxy_set_header Scheme $scheme;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		tcp_nodelay     on;
		proxy_pass http://192.168.3.8/admin;
	    }
	  access_log  off;
	  error_log	/dev/null crit;
  }

server nginx set:

server
{
	listen       80;
	server_name  www.bs.com 192.168.3.8;
	index index.html index.htm index.php;
	root  /mnt/web/adminui-server/public;


	#add_header Access-Control-Allow-Origin *;
	#add_header Access-Control-Allow-Methods POST,GET,OPTIONS;
 	#add_header Access-Control-Allow-Headers Authorization;

	#set_real_ip_from   192.168.50.0/24;
	#set_real_ip_from 127.0.0.1;
	#real_ip_header    X-Forwarded-For;
	#real_ip_recursive on;

     include enable-php.conf;

	location / {
		if (!-e $request_filename){
				rewrite /. /index.php last;
		}
	}

        location ~ \.php$ {
		fastcgi_pass   127.0.0.1:9000;
		include        fastcgi.conf;

	}

	   access_log  off;
	   error_log	/dev/null crit;
}

```
