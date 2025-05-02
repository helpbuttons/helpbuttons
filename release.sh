#!/bin/bash
## fail in any error, and print commands
set -e

request_new_version() {
    # Prompt for the part to update
    echo "Do you want to update the major(M), minor(m), patch(p) or keep(k) version?"
    read -r -n 1 -p "" level
    case $level in
    "k")
        version="${last_version}"
        ;;
    "M")
        major=$(((${last_version:1:1} + 1)))
        version="v${major}.0.0"
        ;;
    "m")
        minor=$(((${last_version:3:1} + 1)))
        version="v${last_version:1:1}.${minor}.0"
        ;;
    "p")
        patch=$(((${last_version:5:1} + 1)))
        version="v${last_version:1:1}.${last_version:3:1}.${patch}"
        ;;
    *)
        echo "Invalid choice. Please run the script again and enter major(M), minor(m), or patch(p)."
        exit 1
        ;;
    esac
    echo ""
    echo $version
}
create_release_github() {
    echo "creating release on github..."
    if [ $version != $last_version ]; then
        curl -L \
            -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer $token" \
            https://api.github.com/repos/helpbuttons/helpbuttons/releases \
            -d '{
            "tag_name": "'"$version"'",
            "target_commitish": "main",
            "name": "'"$version"'",
            "draft": false,
            "prerelease": false,
            "generate_release_notes": true
        }'
    fi
}

release_new_version() {
    # change and pull master
    git checkout main
    git pull

    # Read version from file
    last_version=$(cat last_version)
    version=$(cat version)

    # List of diffs of last master/tag
    git log ${last_version}..HEAD --pretty=format:"%ad - %an - %s %h" --date="format:%d %b,%y"
    
    echo "Are you sure you merged everything from dev to main (y/n)?"
    read -r -n 1 -p "" tested

    case $tested in
    "y")
        token=$(cat .github-token)
        create_release_github
        ;;
    *)
        echo "please merge <3"
        ;;
    esac
    
}

prepare_release() {
    last_version=$(cat version)
    request_new_version
    json_version="{\"version\": \"${version}\"}"
    echo $json_version > web/public/version.json
    echo $json_version > api/src/version.json
    if [ $last_version != $version ]; then
        echo $last_version > last_version
        echo $version > version
    fi
}


echo "Prepare new version release (n) push new version (p)?"
read -r -n 1 -p "" what_u_want

case $what_u_want in
"n")
    echo "Create new version files, please do commit to dev, and then merge to main"
    prepare_release
    echo "Please commit and push to dev, and merge to main"
    echo "git commit -m "preparing release: $version" version last_version api/src/version.json web/public/version.js"
    ;;
"p")
    release_new_version
    ;;
esac
