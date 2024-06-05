FROM httpd:2.4

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

COPY dist /usr/local/apache2/htdocs
COPY build.properties /usr/local/apache2/htdocs
COPY rewrite-to-index.conf /usr/local/apache2/conf/rewrite-to-index.conf

RUN echo "Include /usr/local/apache2/conf/rewrite-to-index.conf" >> /usr/local/apache2/conf/httpd.conf

RUN chmod o+r /usr/local/apache2/htdocs/*
