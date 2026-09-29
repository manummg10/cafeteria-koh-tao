# API de Koh Tao para Render (runtime Docker). El frontend se despliega aparte en Netlify.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY KohTaoBack.csproj ./
RUN dotnet restore KohTaoBack.csproj
COPY . ./
RUN dotnet publish KohTaoBack.csproj -c Release -o /app /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_ENVIRONMENT=Production
USER app
# Render inyecta PORT; 8080 en local
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} exec dotnet KohTaoBack.dll"]
